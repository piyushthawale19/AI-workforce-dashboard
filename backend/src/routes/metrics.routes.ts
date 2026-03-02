import { Router } from "express";
import { MetricsController } from "../controllers/MetricsController";
import { authenticate } from "../middleware/auth";
import { apiLimiter } from "../middleware/rateLimiter";

const router = Router();
const metricsController = new MetricsController();

router.get(
  "/factory",
  authenticate,
  apiLimiter,
  metricsController.getFactoryMetrics,
);
router.get(
  "/workers",
  authenticate,
  apiLimiter,
  metricsController.getWorkerMetrics,
);
router.get(
  "/workstations",
  authenticate,
  apiLimiter,
  metricsController.getWorkstationMetrics,
);

export default router;
