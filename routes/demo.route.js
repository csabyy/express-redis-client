const { Router } = require("express");

const r = Router();

r.get("/", (req, res) => res.json({ message: "'demo path live 🚀" }));

module.exports = r;
