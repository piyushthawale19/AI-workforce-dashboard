import { prisma } from "../config/database";

export class WorkerRepository {
  async create(workerId: string, name: string) {
    return prisma.worker.create({
      data: { workerId, name },
    });
  }

  async findByWorkerId(workerId: string) {
    return prisma.worker.findUnique({
      where: { workerId },
    });
  }

  async findAll() {
    return prisma.worker.findMany({
      orderBy: { workerId: "asc" },
    });
  }

  async upsert(workerId: string, name: string) {
    return prisma.worker.upsert({
      where: { workerId },
      update: { name },
      create: { workerId, name },
    });
  }

  async deleteAll() {
    return prisma.worker.deleteMany({});
  }
}
