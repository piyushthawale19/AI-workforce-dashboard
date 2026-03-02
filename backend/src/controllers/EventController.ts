import { Request, Response, NextFunction } from "express";
import { EventService } from "../services/EventService";
import {
  validateData,
  aiEventSchema,
  batchEventSchema,
} from "../utils/validation";
import logger from "../utils/logger";
import { AuthRequest } from "../middleware/auth";

export class EventController {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  ingestEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = validateData(aiEventSchema, req.body);
      const result = await this.eventService.ingestEvent(validatedData);

      logger.info("Event ingestion request", {
        workerId: validatedData.worker_id,
        eventType: validatedData.event_type,
      });

      res.status(201).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      logger.error("Event ingestion error", { error });
      next(error);
    }
  };

  ingestBatchEvents = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const validatedData = validateData(batchEventSchema, req.body);
      const result = await this.eventService.ingestBatchEvents(
        validatedData.events,
      );

      logger.info("Batch event ingestion completed", {
        totalEvents: validatedData.events.length,
        results: result.results,
      });

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      logger.error("Batch ingestion error", { error });
      next(error);
    }
  };

  resetData = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user?.role !== "admin") {
        logger.warn("Unauthorized reset attempt", { userId: req.user?.userId });
        return res.status(403).json({
          status: "error",
          message: "Admin access required",
        });
      }

      const result = await this.eventService.resetAllData();

      logger.info("Data reset by admin", { userId: req.user.userId });

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      logger.error("Reset data error", { error });
      next(error);
    }
  };

  seedData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.eventService.seedData();

      logger.info("Seed data generated");

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      logger.error("Seed data error", { error });
      next(error);
    }
  };
}
