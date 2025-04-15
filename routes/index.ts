import { Router } from "express";
import demo from "./demo.route";

const router = Router();

router.get("/", (_, res) => {
  res.status(200).end();
});

router.use("/sinch", demo);

export default router;
