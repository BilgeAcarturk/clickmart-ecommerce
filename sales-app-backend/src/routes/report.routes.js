const express = require("express");
const { revenue, topProducts } = require("../controllers/reports.controller");
const { auth, requireRole } = require("../middlewares/auth");

const r = express.Router();
r.get("/revenue",      auth, requireRole("staff","admin"), revenue);
r.get("/top-products", auth, requireRole("staff","admin"), topProducts);

module.exports = r;
