import { Request, Response } from "express";

import express from "express";
import bodyParser from "body-parser";
import * as redis from "redis";
import "dotenv/config";

const app = express();
app.use(bodyParser.json());

const client = redis.createClient({
  url: process.env.REDIS_URL,
});
client.connect().catch(console.error);

client.on("error", (err: unknown) => {
  console.error("Redis error:", err);
});

const LOGS_LIST = "request_logs";

// POST endpoint to log requests
app.post("/log", async (req: Request, res: Response) => {
  const logEntry = {
    timestamp: Date.now(),
    data: req.body,
  };

  try {
    // Store log in a Redis list (keep only last 100)
    await client.lPush(LOGS_LIST, JSON.stringify(logEntry));
    await client.lTrim(LOGS_LIST, 0, 99); // Keep only the last 100 logs

    res.status(201).json({ message: "Log stored" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error storing log" });
  }
});

// GET endpoint to retrieve logs
app.get("/logs", async (_: Request, res: Response) => {
  try {
    const logs = await client.lRange(LOGS_LIST, 0, -1);
    res.json(logs.map((logItem) => JSON.parse(logItem)));
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error retrieving logs" });
  }
});

// Start server
app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});

export default app;
