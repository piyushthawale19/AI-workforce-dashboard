import { prisma } from "./config/database";
import { hashPassword } from "./utils/crypto";

async function seed() {
  try {
    console.log("🌱 Starting database seed...");

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@factory.com" },
    });

    if (existingAdmin) {
      console.log("✅ Admin user already exists");
      return;
    }

    // Create default admin user
    const passwordHash = await hashPassword("password123");

    const adminUser = await prisma.user.create({
      data: {
        email: "admin@factory.com",
        passwordHash,
        role: "admin",
      },
    });

    console.log("✅ Default admin user created:");
    console.log("   Email: admin@factory.com");
    console.log("   Password: password123");
    console.log("   Role: admin");
    console.log("   ID:", adminUser.id);

    // Optionally create a viewer user for testing
    const viewerExists = await prisma.user.findUnique({
      where: { email: "viewer@factory.com" },
    });

    if (!viewerExists) {
      const viewerPasswordHash = await hashPassword("viewer123");
      await prisma.user.create({
        data: {
          email: "viewer@factory.com",
          passwordHash: viewerPasswordHash,
          role: "viewer",
        },
      });
      console.log("✅ Default viewer user created:");
      console.log("   Email: viewer@factory.com");
      console.log("   Password: viewer123");
      console.log("   Role: viewer");
    }

    console.log("\n🎉 Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seed();
}

export { seed };
