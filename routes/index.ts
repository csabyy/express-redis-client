import { Router } from "express";
import demo from "./demo.route";

const router = Router();

router.get("/", (_, res) => {
  res.json({ message: "Hello world!" });
});

router.use("/demo", demo);

export default router;
