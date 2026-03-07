import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { PrismaClient, BeltRank } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

function parseBeltRank(belt: string): BeltRank {
  const normalized = belt?.toLowerCase().trim() || "";
  
  if (normalized.includes("white")) return BeltRank.WHITE;
  if (normalized.includes("yellow")) return BeltRank.YELLOW;
  if (normalized.includes("orange")) return BeltRank.ORANGE;
  if (normalized.includes("green")) return BeltRank.GREEN;
  if (normalized.includes("blue")) return BeltRank.BLUE;
  if (normalized.includes("purple")) return BeltRank.PURPLE;
  if (normalized.includes("brown")) return BeltRank.BROWN;
  if (normalized.includes("red") && normalized.includes("black")) return BeltRank.RED_BLACK;
  if (normalized.includes("red") && normalized.includes("white")) return BeltRank.RED_WHITE;
  if (normalized.includes("red")) return BeltRank.RED;
  if (normalized.includes("black")) return BeltRank.BLACK;
  
  return BeltRank.WHITE;
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  
  // Try common date formats
  const formats = [
    // MM/DD/YYYY
    (s: string) => {
      const match = s.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      return match ? new Date(`${match[3]}-${match[1].padStart(2, '0')}-${match[2].padStart(2, '0')}`) : null;
    },
    // DD/MM/YYYY
    (s: string) => {
      const match = s.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      return match ? new Date(`${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}`) : null;
    },
    // YYYY-MM-DD
    (s: string) => {
      const d = new Date(s);
      return isNaN(d.getTime()) ? null : d;
    },
  ];
  
  for (const format of formats) {
    const result = format(dateStr);
    if (result && !isNaN(result.getTime())) return result;
  }
  
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { spreadsheetId, range, dojoId, importCheckIns = true } = await request.json();

    if (!spreadsheetId || !dojoId) {
      return NextResponse.json(
        { error: "spreadsheetId and dojoId are required" },
        { status: 400 }
      );
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: range || "Sheet1",
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) {
      return NextResponse.json(
        { error: "No data found in spreadsheet" },
        { status: 404 }
      );
    }

    const headers = rows[0].map((h: string) => h.toLowerCase().trim());
    
    // Find column indexes
    const nameIndex = headers.findIndex((h: string) => h.includes("name") || h.includes("student"));
    const emailIndex = headers.findIndex((h: string) => h.includes("email"));
    const phoneIndex = headers.findIndex((h: string) => h.includes("phone") || h.includes("contact"));
    const beltIndex = headers.findIndex((h: string) => h.includes("belt") || h.includes("rank"));
    const stripesIndex = headers.findIndex((h: string) => h.includes("stripe"));
    const dateIndex = headers.findIndex((h: string) => h.includes("date") || h.includes("checkin") || h.includes("check-in"));
    const classIndex = headers.findIndex((h: string) => h.includes("class") || h.includes("session"));
    const schoolIndex = headers.findIndex((h: string) => h.includes("school") || h.includes("dojo") || h.includes("location"));

    if (nameIndex === -1) {
      return NextResponse.json(
        { error: "Could not find 'name' column" },
        { status: 400 }
      );
    }

    const results = {
      studentsImported: 0,
      studentsSkipped: 0,
      checkInsImported: 0,
      schoolsFound: new Set<string>(),
      errors: [] as string[],
    };

    // Track students we've created in this import
    const studentCache = new Map<string, string>(); // name -> id

    // Get or create a default class for imported check-ins
    let defaultClass = await prisma.class.findFirst({
      where: { dojoId },
    });

    if (!defaultClass) {
      const instructor = await prisma.instructor.findFirst({
        where: { dojoId },
      });
      
      if (instructor) {
        defaultClass = await prisma.class.create({
          data: {
            name: "Imported Classes",
            schedule: "See historical records",
            maxStudents: 100,
            dojoId,
            instructorId: instructor.id,
          },
        });
      }
    }

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const name = row[nameIndex]?.trim();

      if (!name) continue;

      try {
        // Track school if column exists
        if (schoolIndex >= 0 && row[schoolIndex]) {
          results.schoolsFound.add(row[schoolIndex].trim());
        }

        // Get or create student
        let studentId = studentCache.get(name);
        
        if (!studentId) {
          const existing = await prisma.student.findFirst({
            where: { name, dojoId },
          });

          if (existing) {
            studentId = existing.id;
            results.studentsSkipped++;
          } else {
            const email = emailIndex >= 0 ? row[emailIndex]?.trim() || null : null;
            const phone = phoneIndex >= 0 ? row[phoneIndex]?.trim() || null : null;
            const beltRaw = beltIndex >= 0 ? row[beltIndex] : "";
            const stripesRaw = stripesIndex >= 0 ? row[stripesIndex] : "0";

            const student = await prisma.student.create({
              data: {
                name,
                email,
                phone,
                beltRank: parseBeltRank(beltRaw),
                stripes: parseInt(stripesRaw) || 0,
                qrCode: crypto.randomUUID(),
                dojoId,
              },
            });

            studentId = student.id;
            results.studentsImported++;
          }
          
          studentCache.set(name, studentId);
        }

        // Import check-in if date column exists and has value
        if (importCheckIns && dateIndex >= 0 && row[dateIndex] && defaultClass) {
          const checkInDate = parseDate(row[dateIndex]);
          
          if (checkInDate) {
            // Check for duplicate check-in on same day
            const startOfDay = new Date(checkInDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(checkInDate);
            endOfDay.setHours(23, 59, 59, 999);

            const existingCheckIn = await prisma.checkIn.findFirst({
              where: {
                studentId,
                dojoId,
                checkedInAt: {
                  gte: startOfDay,
                  lte: endOfDay,
                },
              },
            });

            if (!existingCheckIn) {
              await prisma.checkIn.create({
                data: {
                  studentId,
                  dojoId,
                  classId: defaultClass.id,
                  checkedInAt: checkInDate,
                  method: "import",
                },
              });
              results.checkInsImported++;
            }
          }
        }
      } catch (err) {
        results.errors.push(`Row ${i + 1}: ${name} - ${(err as Error).message}`);
      }
    }

    return NextResponse.json({
      success: true,
      results: {
        ...results,
        schoolsFound: Array.from(results.schoolsFound),
        totalRowsProcessed: rows.length - 1,
      },
    });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { error: "Failed to import", details: (error as Error).message },
      { status: 500 }
    );
  }
}
