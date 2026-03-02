import { AIEventRepository } from "../repositories/AIEventRepository";
import { WorkerRepository } from "../repositories/WorkerRepository";
import { WorkstationRepository } from "../repositories/WorkstationRepository";
import { AIEventDTO } from "../types";
import { AppError } from "../middleware/errorHandler";
import { generateEventHash } from "../utils/hash";
import logger from "../utils/logger";

export class EventService {
  private aiEventRepository: AIEventRepository;
  private workerRepository: WorkerRepository;
  private workstationRepository: WorkstationRepository;

  constructor() {
    this.aiEventRepository = new AIEventRepository();
    this.workerRepository = new WorkerRepository();
    this.workstationRepository = new WorkstationRepository();
  }

  async ingestEvent(eventData: AIEventDTO) {
    const timestamp = new Date(eventData.timestamp);
    const eventHash = generateEventHash(
      eventData.worker_id,
      eventData.workstation_id,
      eventData.timestamp,
      eventData.event_type,
    );

    const duplicate = await this.aiEventRepository.findByHash(eventHash);

    if (duplicate) {
      logger.info("Duplicate event detected", {
        workerId: eventData.worker_id,
        timestamp: eventData.timestamp,
      });
      return { message: "Duplicate event ignored", duplicate: true };
    }

    await this.workerRepository.upsert(
      eventData.worker_id,
      eventData.worker_id,
    );
    await this.workstationRepository.upsert(
      eventData.workstation_id,
      eventData.workstation_id,
    );

    const event = await this.aiEventRepository.create({
      timestamp,
      workerId: eventData.worker_id,
      workstationId: eventData.workstation_id,
      eventType: eventData.event_type,
      confidence: eventData.confidence,
      count: eventData.count || 0,
      modelVersion: eventData.model_version || "v1.0",
      eventHash,
    });

    logger.info("Event ingested", {
      workerId: eventData.worker_id,
      eventType: eventData.event_type,
      confidence: eventData.confidence,
    });

    return { message: "Event ingested successfully", event };
  }

  async ingestBatchEvents(events: AIEventDTO[]) {
    const results = {
      successful: 0,
      duplicates: 0,
      errors: 0,
    };

    for (const event of events) {
      try {
        const result = await this.ingestEvent(event);
        if (result.duplicate) {
          results.duplicates++;
        } else {
          results.successful++;
        }
      } catch (error) {
        results.errors++;
        logger.error("Batch event ingestion error", { error, event });
      }
    }

    logger.info("Batch ingestion completed", results);

    return {
      message: "Batch ingestion completed",
      results,
    };
  }

  async resetAllData() {
    logger.warn("Resetting all data - this will delete everything");

    await this.aiEventRepository.deleteAll();
    await this.workerRepository.deleteAll();
    await this.workstationRepository.deleteAll();

    const workers = [
      { workerId: "W001", name: "Alice Johnson" },
      { workerId: "W002", name: "Bob Smith" },
      { workerId: "W003", name: "Carol Martinez" },
      { workerId: "W004", name: "David Lee" },
      { workerId: "W005", name: "Emma Wilson" },
      { workerId: "W006", name: "Frank Garcia" },
    ];

    const workstations = [
      { stationId: "S001", name: "Assembly Line 1" },
      { stationId: "S002", name: "Assembly Line 2" },
      { stationId: "S003", name: "Quality Check 1" },
      { stationId: "S004", name: "Packaging Station" },
      { stationId: "S005", name: "Testing Station" },
      { stationId: "S006", name: "Final Inspection" },
    ];

    for (const worker of workers) {
      await this.workerRepository.upsert(worker.workerId, worker.name);
    }

    for (const station of workstations) {
      await this.workstationRepository.upsert(station.stationId, station.name);
    }

    const baseTime = new Date("2026-03-01T08:00:00Z");
    const events: AIEventDTO[] = [];

    for (let i = 0; i < 200; i++) {
      const worker = workers[i % workers.length];
      const station = workstations[i % workstations.length];
      const minutesOffset = i * 10;
      const timestamp = new Date(baseTime.getTime() + minutesOffset * 60000);

      const isWorking = Math.random() > 0.25;
      const eventType = isWorking ? "working" : "idle";
      const count = isWorking ? Math.floor(Math.random() * 8) + 1 : 0;
      const confidence = 0.6 + Math.random() * 0.39;

      events.push({
        timestamp: timestamp.toISOString(),
        worker_id: worker.workerId,
        workstation_id: station.stationId,
        event_type: eventType,
        confidence,
        count,
        model_version: `v${Math.floor(Math.random() * 3) + 1}.0`,
      });
    }

    for (const event of events) {
      await this.ingestEvent(event);
    }

    logger.info("Data reset completed", {
      workers: workers.length,
      workstations: workstations.length,
      events: events.length,
    });

    return {
      message: "All data reset and repopulated successfully",
      stats: {
        workers: workers.length,
        workstations: workstations.length,
        events: events.length,
      },
    };
  }

  async seedData() {
    const workers = [
      { workerId: "W001", name: "Alice Johnson" },
      { workerId: "W002", name: "Bob Smith" },
      { workerId: "W003", name: "Carol Martinez" },
      { workerId: "W004", name: "David Lee" },
      { workerId: "W005", name: "Emma Wilson" },
    ];

    const workstations = [
      { stationId: "S001", name: "Assembly Line 1" },
      { stationId: "S002", name: "Assembly Line 2" },
      { stationId: "S003", name: "Quality Check 1" },
      { stationId: "S004", name: "Packaging Station" },
      { stationId: "S005", name: "Testing Station" },
    ];

    for (const worker of workers) {
      await this.workerRepository.upsert(worker.workerId, worker.name);
    }

    for (const station of workstations) {
      await this.workstationRepository.upsert(station.stationId, station.name);
    }

    const baseTime = new Date("2026-03-01T08:00:00Z");
    const events: AIEventDTO[] = [];

    for (let i = 0; i < 100; i++) {
      const worker = workers[i % workers.length];
      const station = workstations[i % workstations.length];
      const minutesOffset = i * 15;
      const timestamp = new Date(baseTime.getTime() + minutesOffset * 60000);

      const isWorking = Math.random() > 0.3;
      const eventType = isWorking ? "working" : "idle";
      const count = isWorking ? Math.floor(Math.random() * 5) + 1 : 0;

      events.push({
        timestamp: timestamp.toISOString(),
        worker_id: worker.workerId,
        workstation_id: station.stationId,
        event_type: eventType,
        confidence: 0.85 + Math.random() * 0.14,
        count,
      });
    }

    for (const event of events) {
      await this.ingestEvent(event);
    }

    return {
      message: "Seed data created successfully",
      stats: {
        workers: workers.length,
        workstations: workstations.length,
        events: events.length,
      },
    };
  }
}
