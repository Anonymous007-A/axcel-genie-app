import { PrismaClient } from '@prisma/client';

// Sabse simple initialization, koi options nahi
const prisma = new PrismaClient();

async function main() {
  console.log("🔗 Supabase se connect ho raha hai...");
  
  try {
    const tables: any[] = await prisma.$queryRaw`
      SELECT tablename FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public'
    `;
    
    console.log("\n🚀 Database mein ye tables mili hain:");
    tables.forEach(t => console.log(`✅ ${t.tablename}`));

    console.log("\n📊 Data Summary:");
    const projectCount = await prisma.project.count();
    console.log(`- Total Projects: ${projectCount}`);

  } catch (err: any) {
    console.error("\n❌ DB Query Error:", err.message);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());