import { Request, Response, Router } from "express";
import * as redis from "redis";

const router = Router();

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (err: unknown) => {
  console.error("Redis error:", err);
});

const LOGS_LIST = "request_logs";

// POST endpoint to log requests
router.post("/log", async (req: Request, res: Response) => {
  const logEntry = {
    timestamp: Date.now(),
    data: req.body,
  };

  try {
    await client.connect();
    // Store log in a Redis list (keep only last 100)
    await client.lPush(LOGS_LIST, JSON.stringify(logEntry));
    await client.lTrim(LOGS_LIST, 0, 99); // Keep only the last 100 logs

    res.status(201).json({ message: "Log stored" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error storing log" });
  } finally {
    await client.disconnect();
  }
});

// GET endpoint to retrieve logs
router.get("/logs", async (_: Request, res: Response) => {
  try {
    await client.connect();

    const logs = await client.lRange(LOGS_LIST, 0, -1);
    res.json(logs.map((logItem) => JSON.parse(logItem)));
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error retrieving logs" });
  } finally {
    await client.disconnect();
  }
});

export default router;
