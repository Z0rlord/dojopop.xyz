import { PrismaClient, BeltRank } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create dojo
  const dojo = await prisma.dojo.create({
    data: {
      name: "Warsaw BJJ Academy",
      location: "Warsaw, Poland",
      timezone: "Europe/Warsaw",
    },
  });
  console.log("Created dojo:", dojo.name);

  // Create instructors
  const instructor1 = await prisma.instructor.create({
    data: {
      name: "Sensei Mike",
      email: "mike@dojopop.com",
      password: crypto.createHash("sha256").update("password123").digest("hex"),
      isAdmin: true,
      dojoId: dojo.id,
    },
  });

  const instructor2 = await prisma.instructor.create({
    data: {
      name: "Professor Ana",
      email: "ana@dojopop.com",
      password: crypto.createHash("sha256").update("password123").digest("hex"),
      isAdmin: false,
      dojoId: dojo.id,
    },
  });

  const instructor3 = await prisma.instructor.create({
    data: {
      name: "Kru Tom",
      email: "tom@dojopop.com",
      password: crypto.createHash("sha256").update("password123").digest("hex"),
      isAdmin: false,
      dojoId: dojo.id,
    },
  });
  console.log("Created 3 instructors");

  // Create classes
  const class1 = await prisma.class.create({
    data: {
      name: "Kids BJJ",
      schedule: "Mon/Wed 16:00-17:00",
      maxStudents: 20,
      dojoId: dojo.id,
      instructorId: instructor1.id,
    },
  });

  const class2 = await prisma.class.create({
    data: {
      name: "Adult BJJ",
      schedule: "Mon/Wed 19:00-20:30",
      maxStudents: 30,
      dojoId: dojo.id,
      instructorId: instructor2.id,
    },
  });

  const class3 = await prisma.class.create({
    data: {
      name: "Muay Thai",
      schedule: "Tue/Thu 18:00-19:30",
      maxStudents: 25,
      dojoId: dojo.id,
      instructorId: instructor3.id,
    },
  });
  console.log("Created 3 classes");

  // Create students
  const student1 = await prisma.student.create({
    data: {
      name: "Jan Kowalski",
      email: "jan@example.com",
      phone: "+48 123 456 789",
      beltRank: BeltRank.WHITE,
      stripes: 2,
      qrCode: crypto.randomUUID(),
      dojoId: dojo.id,
    },
  });

  const student2 = await prisma.student.create({
    data: {
      name: "Anna Nowak",
      email: "anna@example.com",
      phone: "+48 987 654 321",
      beltRank: BeltRank.YELLOW,
      stripes: 1,
      qrCode: crypto.randomUUID(),
      dojoId: dojo.id,
    },
  });

  const student3 = await prisma.student.create({
    data: {
      name: "Piotr Wiśniewski",
      email: "piotr@example.com",
      beltRank: BeltRank.ORANGE,
      stripes: 0,
      qrCode: crypto.randomUUID(),
      dojoId: dojo.id,
    },
  });
  console.log("Created 3 students");

  console.log("\n✅ Seed completed!");
  console.log("Dojo ID:", dojo.id);
  console.log("\nDemo login credentials:");
  console.log("  Admin: mike@dojopop.com / password123");
  console.log("  Instructor: ana@dojopop.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
