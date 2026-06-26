const express = require("express");
const {
  createOrder,
  getOrder,
  listOrders,
  updateOrderStatus,
  updatePaymentStatus,
} = require("../controllers/order.controller");
const { auth, requireRole } = require("../middlewares/auth");

const r = express.Router();

r.post("/orders", auth, createOrder);
r.get("/orders", auth, listOrders);
r.get("/orders/:id", auth, getOrder);

r.patch("/orders/:id/status", auth, requireRole("staff"), updateOrderStatus);
r.patch("/orders/:id/payment", auth, requireRole("staff"), updatePaymentStatus);

module.exports = r;
