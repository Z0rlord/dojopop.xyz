import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { PrismaClient, BeltRank } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

// Map common belt names to our enum
function parseBeltRank(belt: string): BeltRank {
  const normalized = belt.toLowerCase().trim();
  
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
  
  return BeltRank.WHITE; // Default
}

export async function POST(request: NextRequest) {
  try {
    const { spreadsheetId, range, dojoId } = await request.json();

    if (!spreadsheetId || !dojoId) {
      return NextResponse.json(
        { error: "spreadsheetId and dojoId are required" },
        { status: 400 }
      );
    }

    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Fetch data from Google Sheet
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

    // Assume first row is headers
    const headers = rows[0].map((h: string) => h.toLowerCase().trim());
    const nameIndex = headers.findIndex((h: string) => h.includes("name") || h.includes("student"));
    const emailIndex = headers.findIndex((h: string) => h.includes("email"));
    const phoneIndex = headers.findIndex((h: string) => h.includes("phone") || h.includes("contact"));
    const beltIndex = headers.findIndex((h: string) => h.includes("belt") || h.includes("rank"));
    const stripesIndex = headers.findIndex((h: string) => h.includes("stripe"));

    if (nameIndex === -1) {
      return NextResponse.json(
        { error: "Could not find 'name' column in spreadsheet" },
        { status: 400 }
      );
    }

    const results = {
      imported: 0,
      skipped: 0,
      errors: [] as string[],
      students: [] as any[],
    };

    // Process each row
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const name = row[nameIndex]?.trim();

      if (!name) {
        results.skipped++;
        continue;
      }

      try {
        // Check if student already exists
        const existing = await prisma.student.findFirst({
          where: {
            name,
            dojoId,
          },
        });

        if (existing) {
          results.skipped++;
          continue;
        }

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

        results.imported++;
        results.students.push({
          id: student.id,
          name: student.name,
          qrCode: student.qrCode,
        });
      } catch (err) {
        results.errors.push(`Row ${i + 1}: ${name} - ${(err as Error).message}`);
      }
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { error: "Failed to import from Google Sheets", details: (error as Error).message },
      { status: 500 }
    );
  }
}
