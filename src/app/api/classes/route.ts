import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all classes
export async function GET() {
  try {
    const classes = await prisma.class.findMany({
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      classes: classes.map((c) => ({
        id: c.id,
        name: c.name,
        schedule: c.schedule,
        location: c.location,
        maxStudents: c.maxStudents,
        instructorId: c.instructorId,
        instructorName: c.instructor.name,
      })),
    });
  } catch (error: any) {
    console.error("Fetch classes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch classes" },
      { status: 500 }
    );
  }
}

// POST create new class
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, schedule, location, maxStudents, instructorId } = body;

    if (!name || !schedule) {
      return NextResponse.json(
        { error: "Name and schedule are required" },
        { status: 400 }
      );
    }

    // For now, use a default dojo and instructor
    // In production, this would come from the session
    const dojo = await prisma.dojo.findFirst();
    if (!dojo) {
      return NextResponse.json(
        { error: "No dojo found" },
        { status: 400 }
      );
    }

    let targetInstructorId = instructorId;
    if (!targetInstructorId) {
      const instructor = await prisma.instructor.findFirst({
        where: { dojoId: dojo.id },
      });
      if (!instructor) {
        return NextResponse.json(
          { error: "No instructor found" },
          { status: 400 }
        );
      }
      targetInstructorId = instructor.id;
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        schedule,
        location,
        maxStudents: maxStudents || 20,
        dojoId: dojo.id,
        instructorId: targetInstructorId,
      },
      include: {
        instructor: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      class: {
        id: newClass.id,
        name: newClass.name,
        schedule: newClass.schedule,
        location: newClass.location,
        maxStudents: newClass.maxStudents,
        instructorName: newClass.instructor.name,
      },
    });
  } catch (error: any) {
    console.error("Create class error:", error);
    return NextResponse.json(
      { error: "Failed to create class" },
      { status: 500 }
    );
  }
}
