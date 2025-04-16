import { Router } from "express";
import sinch from "./sinch";

const router = Router();

router.get("/", (_, res) => {
  res.status(200).end();
});

router.use("/sinch", sinch);

export default router;
