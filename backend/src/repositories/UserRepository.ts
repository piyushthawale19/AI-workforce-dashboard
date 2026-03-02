import { prisma } from "../config/database";
import { RegisterDTO } from "../types";

export class UserRepository {
  async create(data: { email: string; passwordHash: string; role?: string }) {
    return prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role || "viewer",
      },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
    });
  }
}
