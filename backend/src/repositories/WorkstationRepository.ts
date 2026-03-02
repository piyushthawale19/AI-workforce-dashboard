import { prisma } from "../config/database";

export class WorkstationRepository {
  async create(stationId: string, name: string) {
    return prisma.workstation.create({
      data: { stationId, name },
    });
  }

  async findByStationId(stationId: string) {
    return prisma.workstation.findUnique({
      where: { stationId },
    });
  }

  async findAll() {
    return prisma.workstation.findMany({
      orderBy: { stationId: "asc" },
    });
  }

  async upsert(stationId: string, name: string) {
    return prisma.workstation.upsert({
      where: { stationId },
      update: { name },
      create: { stationId, name },
    });
  }

  async deleteAll() {
    return prisma.workstation.deleteMany({});
  }
}
