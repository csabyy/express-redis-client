import { Router } from "express";

const router = Router();

router.get("/", (_, res) => {
  res.json({ message: "'demo path live 🚀" });
});

export default router;
