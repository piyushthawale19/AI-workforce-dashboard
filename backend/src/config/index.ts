import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwt: {
    secret: process.env.JWT_SECRET || "fallback-secret-not-for-production",
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },
  database: {
    url: process.env.DATABASE_URL || "file:./dev.db",
  },
};
