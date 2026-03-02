import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config";
import { connectDatabase } from "./config/database";
import { errorHandler } from "./middleware/errorHandler";
import { seed } from "./seed";

import authRoutes from "./routes/auth.routes";
import apiRoutes from "./routes/api.routes";
import metricsRoutes from "./routes/metrics.routes";

const app: Application = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health", (req: any, res: any) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);
app.use("/api/metrics", metricsRoutes);

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDatabase();

    // Initialize default admin user
    await seed();

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
      console.log(`Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
