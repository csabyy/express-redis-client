import express from "express";
import helmet from "helmet";
import routes from "./routes";
import "dotenv/config";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(helmet());
app.use("/", routes);

app.listen(3000).on("listening", () => {
  console.info("server is listening on port http://localhost:3000");
});

export default app;
