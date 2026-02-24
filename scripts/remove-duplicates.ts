import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Find all Tom Jones accounts
  const tomAccounts = await prisma.student.findMany({
    where: {
      OR: [
        { name: { contains: 'Tom', mode: 'insensitive' } },
        { email: { contains: 'bullet', mode: 'insensitive' } }
      ]
    },
    orderBy: { joinedAt: 'asc' }
  });

  console.log(`Found ${tomAccounts.length} Tom Jones accounts:`);
  tomAccounts.forEach((acc, i) => {
    console.log(`${i + 1}. ${acc.name} | ${acc.email} | ${acc.joinedAt}`);
  });

  // Keep the most recent one, delete the rest
  if (tomAccounts.length > 1) {
    const keep = tomAccounts[tomAccounts.length - 1]; // Most recent
    const toDelete = tomAccounts.slice(0, -1);

    console.log(`\nKeeping: ${keep.name} (${keep.id})`);
    console.log(`Deleting ${toDelete.length} duplicate(s)...`);

    for (const account of toDelete) {
      await prisma.student.delete({ where: { id: account.id } });
      console.log(`Deleted: ${account.name} (${account.id})`);
    }

    console.log('\nCleanup complete!');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
