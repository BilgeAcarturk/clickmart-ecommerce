// src/controllers/order.controller.js
const prisma = require("../config/prisma");
const { getIO } = require("../config/io");

const safeIO = () => { try { return getIO(); } catch { return null; } };

// ORDER: create (txn + stok düş + kargo/total)
const createOrder = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const { items, shippingAddress, paymentMethod } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const userId = Number(req.user.id);
    const norm = items.map(i => ({
      productId: Number(i.productId),
      qty: Math.max(1, Number(i.qty) || 1),
    }));
    const productIds = [...new Set(norm.map(i => i.productId))];

    const created = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, price: true, stock: true },
      });
      if (products.length !== productIds.length) throw new Error("INVALID_PRODUCT");

   
      for (const it of norm) {
        const p = products.find(pp => pp.id === it.productId);
        if (!p || p.stock < it.qty) throw new Error("OUT_OF_STOCK");
      }

  
      for (const it of norm) {
        const u = await tx.product.updateMany({
          where: { id: it.productId, stock: { gte: it.qty } },
          data: { stock: { decrement: it.qty } },
        });
        if (u.count !== 1) throw new Error("OUT_OF_STOCK");
      }

      let subTotalCents = 0;
      const orderItemsData = norm.map(it => {
        const p = products.find(pp => pp.id === it.productId);
        const unitPriceCents = Math.round(Number(p.price) * 100);
        subTotalCents += unitPriceCents * it.qty;
        return { productId: it.productId, qty: it.qty, unitPriceCents };
      });
      const shippingCents = subTotalCents > 30000 ? 0 : 1999;
      const totalCents = subTotalCents + shippingCents;

      return tx.order.create({
        data: {
          userId,
          paymentMethod,
          shippingAddress,
          shippingCents,
          totalCents,
          orderitem: { create: orderItemsData },
        },
        include: { orderitem: true },
      });
    });


    const io = safeIO();
    if (io) {
      io.to("staff").emit("order:new", {
        id: created.id,
        userId: created.userId,
        totalCents: created.totalCents,
        shippingCents: created.shippingCents,
        createdAt: created.createdAt,
      });
    }

    return res.status(201).json(created);
  } catch (error) {
    if (error.message === "OUT_OF_STOCK")
      return res.status(409).json({ message: "Out of stock", code: "OUT_OF_STOCK" });
    if (error.message === "INVALID_PRODUCT")
      return res.status(400).json({ message: "Invalid product", code: "INVALID_PRODUCT" });
    console.error("CREATE_ORDER_ERROR", error);
    return res.status(500).json({ message: error.message || "Failed to create order", code: error.code, meta: error.meta });
  }
};

const getOrder = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const order = await prisma.order.findUnique({
      where: { id },
      include: { orderitem: { include: { product: true } } },
    });
    if (!order || order.userId !== Number(req.user.id))
      return res.status(404).json({ message: "Order not found" });
    return res.json(order);
  } catch (error) {
    console.error("GET_ORDER_ERROR", error);
    return res.status(500).json({ message: error.message || "Failed to fetch order", code: error.code, meta: error.meta });
  }
};

const listOrders = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const role = String(req.user.role || "");
    const page = Number(req.query.page || 1);
    const pageSize = Number(req.query.pageSize || 20);
    const { status, from, to } = req.query;

    const where = {
      ...(role === "staff" || role === "admin" ? {} : { userId }),
      ...(status ? { status } : {}),
      ...((from || to) ? {
        createdAt: {
          ...(from ? { gte: new Date(from) } : {}),
          ...(to ? { lte: new Date(to) } : {}),
        }
      } : {})
    };

    const [rows, total] = await prisma.$transaction([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: { id: true, status: true, paymentStatus: true, shippingCents: true, totalCents: true, createdAt: true },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      data: rows,
      meta: { page, pageSize, total, pageCount: Math.ceil(total / pageSize) }
    });
  } catch (e) {
    console.error("LIST_ORDERS_ERROR", e);
    res.status(500).json({ message: e.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body || {};
    const allowed = ["PENDING","CONFIRMED","SHIPPED","DELIVERED","CANCELED"];
    if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

    const result = await prisma.$transaction(async (tx) => {
      const current = await tx.order.findUnique({ where: { id }, include: { orderitem: true } });
      if (!current) return null;

      if (status === "CANCELED" && current.status !== "CANCELED") {
        for (const it of current.orderitem) {
          await tx.product.update({
            where: { id: it.productId },
            data: { stock: { increment: it.qty } },
          });
        }
      }
      return tx.order.update({ where: { id }, data: { status } });
    });

    if (!result) return res.status(404).json({ message: "Order not found" });

    const io = safeIO();
    if (io) io.to("staff").emit("order:updated", { id: result.id, status: result.status });

    res.json(result);
  } catch (e) {
    console.error("UPDATE_STATUS_ERROR", e);
    res.status(500).json({ message: e.message, code: e.code, meta: e.meta });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { paymentStatus } = req.body || {};
    const allowed = ["PENDING","PAID","FAILED","REFUNDED"];
    if (!allowed.includes(paymentStatus)) return res.status(400).json({ message: "Invalid paymentStatus" });

    const updated = await prisma.order.update({ where: { id }, data: { paymentStatus } });

    const io = safeIO();
    if (io) io.to("staff").emit("order:updated", { id: updated.id, paymentStatus: updated.paymentStatus });

    res.json(updated);
  } catch (e) {
    if (e.code === "P2025") return res.status(404).json({ message: "Order not found" });
    console.error("UPDATE_PAYMENT_ERROR", e);
    res.status(500).json({ message: e.message, code: e.code, meta: e.meta });
  }
};

module.exports = { createOrder, getOrder, listOrders, updateOrderStatus, updatePaymentStatus };
