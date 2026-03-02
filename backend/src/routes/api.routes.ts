import { Router } from "express";
import { EventController } from "../controllers/EventController";
import { authenticate } from "../middleware/auth";
import { eventLimiter, apiLimiter } from "../middleware/rateLimiter";

const router = Router();
const eventController = new EventController();

router.post("/events", authenticate, eventLimiter, eventController.ingestEvent);
router.post(
  "/events/batch",
  authenticate,
  eventLimiter,
  eventController.ingestBatchEvents,
);
router.post("/seed", authenticate, apiLimiter, eventController.seedData);
router.post(
  "/admin/reset-data",
  authenticate,
  apiLimiter,
  eventController.resetData,
);

export default router;
