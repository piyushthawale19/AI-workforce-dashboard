import crypto from "crypto";

export function generateEventHash(
  workerId: string,
  workstationId: string,
  timestamp: string,
  eventType: string,
): string {
  const data = `${workerId}|${workstationId}|${timestamp}|${eventType}`;
  return crypto.createHash("sha256").update(data).digest("hex");
}
