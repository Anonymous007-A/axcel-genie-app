import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.upsert({
    where: { id: 'u1' },
    update: {
      plan: 'PRO',
      role: 'ADMIN',
    },
    create: {
      id: 'u1',
      name: 'Dummy User',
      email: 'dummy@axcelgenie.com',
      plan: 'PRO',
      role: 'ADMIN',
    },
  });
  
  console.log('Dummy User created/updated:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });