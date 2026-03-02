import { Request, Response, NextFunction } from "express";
import { MetricsService } from "../services/MetricsService";

export class MetricsController {
  private metricsService: MetricsService;

  constructor() {
    this.metricsService = new MetricsService();
  }

  getWorkerMetrics = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const metrics = await this.metricsService.getWorkerMetrics();

      res.status(200).json({
        status: "success",
        data: metrics,
      });
    } catch (error) {
      next(error);
    }
  };

  getWorkstationMetrics = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const metrics = await this.metricsService.getWorkstationMetrics();

      res.status(200).json({
        status: "success",
        data: metrics,
      });
    } catch (error) {
      next(error);
    }
  };

  getFactoryMetrics = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const metrics = await this.metricsService.getFactoryMetrics();

      res.status(200).json({
        status: "success",
        data: metrics,
      });
    } catch (error) {
      next(error);
    }
  };
}
