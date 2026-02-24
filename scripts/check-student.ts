import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const students = await prisma.student.findMany({
    where: {
      OR: [
        { name: { contains: 'Tom', mode: 'insensitive' } },
        { email: { contains: 'tomjones', mode: 'insensitive' } }
      ]
    },
    select: { 
      id: true, 
      name: true, 
      email: true, 
      beltRank: true, 
      joinedAt: true 
    }
  });
  
  console.log('Found students:');
  console.log(JSON.stringify(students, null, 2));
  
  // Also show most recent students
  const recent = await prisma.student.findMany({
    orderBy: { joinedAt: 'desc' },
    take: 3,
    select: { id: true, name: true, email: true, joinedAt: true }
  });
  
  console.log('\nMost recent signups:');
  console.log(JSON.stringify(recent, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
