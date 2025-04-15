const { Router } = require("express");
const demo = require("./demo.route");

const router = Router();

router.use("/demo", demo);

module.exports = r;
