const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkAdmin() {
  try {
    const admin = await prisma.user.findUnique({
      where: { email: "admin@factory.com" },
    });

    console.log("=== Admin User Info ===");
    console.log(JSON.stringify(admin, null, 2));

    if (admin && admin.role !== "admin") {
      console.log('\n⚠️ WARNING: Role is not "admin", updating...');
      await prisma.user.update({
        where: { email: "admin@factory.com" },
        data: { role: "admin" },
      });
      console.log("✅ Role updated to admin");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();
