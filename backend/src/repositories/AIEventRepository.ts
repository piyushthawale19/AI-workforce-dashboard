import { prisma } from "../config/database";
import { AIEventDTO } from "../types";

export class AIEventRepository {
  async create(data: {
    timestamp: Date;
    workerId: string;
    workstationId: string;
    eventType: string;
    confidence: number;
    count: number;
    modelVersion?: string;
    eventHash: string;
  }) {
    return prisma.aIEvent.create({
      data: {
        timestamp: data.timestamp,
        workerId: data.workerId,
        workstationId: data.workstationId,
        eventType: data.eventType,
        confidence: data.confidence,
        count: data.count,
        modelVersion: data.modelVersion,
        eventHash: data.eventHash,
      },
    });
  }

  async findByHash(eventHash: string) {
    return prisma.aIEvent.findUnique({
      where: { eventHash },
    });
  }

  async findDuplicate(
    workerId: string,
    workstationId: string,
    timestamp: Date,
    eventType: string,
  ) {
    return prisma.aIEvent.findFirst({
      where: {
        workerId,
        workstationId,
        timestamp,
        eventType,
      },
    });
  }

  async findAll() {
    return prisma.aIEvent.findMany({
      where: {
        confidence: {
          gte: 0.6,
        },
      },
      orderBy: { timestamp: "asc" },
      include: {
        worker: true,
        workstation: true,
      },
    });
  }

  async findByWorkerId(workerId: string) {
    return prisma.aIEvent.findMany({
      where: {
        workerId,
        confidence: {
          gte: 0.6,
        },
      },
      orderBy: { timestamp: "asc" },
    });
  }

  async findByWorkstationId(workstationId: string) {
    return prisma.aIEvent.findMany({
      where: {
        workstationId,
        confidence: {
          gte: 0.6,
        },
      },
      orderBy: { timestamp: "asc" },
    });
  }

  async getUniqueWorkerIds() {
    const result = await prisma.aIEvent.findMany({
      where: {
        confidence: {
          gte: 0.6,
        },
      },
      distinct: ["workerId"],
      select: { workerId: true },
    });
    return result.map((r: { workerId: string }) => r.workerId);
  }

  async getUniqueWorkstationIds() {
    const result = await prisma.aIEvent.findMany({
      where: {
        confidence: {
          gte: 0.6,
        },
      },
      distinct: ["workstationId"],
      select: { workstationId: true },
    });
    return result.map((r: { workstationId: string }) => r.workstationId);
  }

  async deleteAll() {
    return prisma.aIEvent.deleteMany({});
  }
}
