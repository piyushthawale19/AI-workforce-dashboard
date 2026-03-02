import { AIEventRepository } from "../repositories/AIEventRepository";
import { WorkerRepository } from "../repositories/WorkerRepository";
import { WorkstationRepository } from "../repositories/WorkstationRepository";
import { WorkerMetrics, WorkstationMetrics, FactoryMetrics } from "../types";

interface ProcessedEvent {
  timestamp: Date;
  eventType: string;
  count: number;
}

export class MetricsService {
  private aiEventRepository: AIEventRepository;
  private workerRepository: WorkerRepository;
  private workstationRepository: WorkstationRepository;

  constructor() {
    this.aiEventRepository = new AIEventRepository();
    this.workerRepository = new WorkerRepository();
    this.workstationRepository = new WorkstationRepository();
  }

  private sortEvents(events: ProcessedEvent[]): ProcessedEvent[] {
    return events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  private calculateTimeMetrics(events: ProcessedEvent[]) {
    if (events.length === 0) {
      return { totalActiveTime: 0, totalIdleTime: 0, totalUnits: 0 };
    }

    const sortedEvents = this.sortEvents(events);
    let totalActiveTime = 0;
    let totalIdleTime = 0;
    let totalUnits = 0;

    for (let i = 0; i < sortedEvents.length - 1; i++) {
      const current = sortedEvents[i];
      const next = sortedEvents[i + 1];

      const timeDelta =
        (next.timestamp.getTime() - current.timestamp.getTime()) / 1000 / 60;

      if (current.eventType === "working") {
        totalActiveTime += timeDelta;
        totalUnits += current.count;
      } else {
        totalIdleTime += timeDelta;
      }
    }

    const lastEvent = sortedEvents[sortedEvents.length - 1];
    if (lastEvent.eventType === "working") {
      totalUnits += lastEvent.count;
    }

    return { totalActiveTime, totalIdleTime, totalUnits };
  }

  async getWorkerMetrics(): Promise<WorkerMetrics[]> {
    const workers = await this.workerRepository.findAll();
    const metrics: WorkerMetrics[] = [];

    for (const worker of workers) {
      const events = await this.aiEventRepository.findByWorkerId(
        worker.workerId,
      );

      const processedEvents = events.map((e: any) => ({
        timestamp: e.timestamp,
        eventType: e.eventType,
        count: e.count,
      }));

      const { totalActiveTime, totalIdleTime, totalUnits } =
        this.calculateTimeMetrics(processedEvents);

      const totalTime = totalActiveTime + totalIdleTime;
      const utilizationPercentage =
        totalTime > 0 ? (totalActiveTime / totalTime) * 100 : 0;
      const unitsPerHour =
        totalActiveTime > 0 ? (totalUnits / totalActiveTime) * 60 : 0;

      metrics.push({
        workerId: worker.workerId,
        name: worker.name,
        totalActiveTime: Math.round(totalActiveTime * 100) / 100,
        totalIdleTime: Math.round(totalIdleTime * 100) / 100,
        utilizationPercentage: Math.round(utilizationPercentage * 100) / 100,
        totalUnits,
        unitsPerHour: Math.round(unitsPerHour * 100) / 100,
      });
    }

    return metrics;
  }

  async getWorkstationMetrics(): Promise<WorkstationMetrics[]> {
    const workstations = await this.workstationRepository.findAll();
    const metrics: WorkstationMetrics[] = [];

    for (const station of workstations) {
      const events = await this.aiEventRepository.findByWorkstationId(
        station.stationId,
      );

      const processedEvents = events.map((e: any) => ({
        timestamp: e.timestamp,
        eventType: e.eventType,
        count: e.count,
      }));

      const { totalActiveTime, totalIdleTime, totalUnits } =
        this.calculateTimeMetrics(processedEvents);

      const occupancyTime = totalActiveTime + totalIdleTime;
      const utilizationPercentage =
        occupancyTime > 0 ? (totalActiveTime / occupancyTime) * 100 : 0;
      const throughputRate =
        totalActiveTime > 0 ? (totalUnits / totalActiveTime) * 60 : 0;

      metrics.push({
        stationId: station.stationId,
        name: station.name,
        occupancyTime: Math.round(occupancyTime * 100) / 100,
        utilizationPercentage: Math.round(utilizationPercentage * 100) / 100,
        totalUnits,
        throughputRate: Math.round(throughputRate * 100) / 100,
      });
    }

    return metrics;
  }

  async getFactoryMetrics(): Promise<FactoryMetrics> {
    const allEvents = await this.aiEventRepository.findAll();

    const processedEvents = allEvents.map((e: any) => ({
      timestamp: e.timestamp,
      eventType: e.eventType,
      count: e.count,
    }));

    const { totalActiveTime, totalIdleTime, totalUnits } =
      this.calculateTimeMetrics(processedEvents);

    const totalObservedTime = totalActiveTime + totalIdleTime;
    const averageUtilization =
      totalObservedTime > 0 ? (totalActiveTime / totalObservedTime) * 100 : 0;
    const averageProductionRate =
      totalActiveTime > 0 ? (totalUnits / totalActiveTime) * 60 : 0;

    const workersCount = await this.workerRepository
      .findAll()
      .then((w) => w.length);
    const workstationsCount = await this.workstationRepository
      .findAll()
      .then((s) => s.length);

    return {
      totalProductiveTime: Math.round(totalActiveTime * 100) / 100,
      totalProductionCount: totalUnits,
      averageProductionRate: Math.round(averageProductionRate * 100) / 100,
      averageUtilization: Math.round(averageUtilization * 100) / 100,
      workersCount,
      workstationsCount,
    };
  }
}
