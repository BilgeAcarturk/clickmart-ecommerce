const prisma = require("../config/prisma");

const parseRange = (q) => {
  const to = q.to ? new Date(q.to) : new Date();
  const from = q.from ? new Date(q.from) : new Date(to.getTime() - 30 * 864e5);
  return { from, to };
};

const toNum = (v) => (typeof v === "bigint" ? Number(v) : (v?.toNumber?.() ?? Number(v)));

const revenue = async (req, res) => {
  try {
    const { from, to } = parseRange(req.query);
    const gran = (req.query.granularity || "day").toLowerCase(); // day|week|month
    const fmt = gran === "month" ? "%Y-%m" : gran === "week" ? "%x-%v" : "%Y-%m-%d";

    const rows = await prisma.$queryRaw`
      SELECT DATE_FORMAT(createdAt, ${fmt}) AS bucket,
             SUM(totalCents) AS revenueCents,
             COUNT(*) AS orders
      FROM \`order\`
      WHERE paymentStatus='PAID' AND createdAt BETWEEN ${from} AND ${to}
      GROUP BY bucket
      ORDER BY bucket ASC;
    `;

    const out = rows.map(r => ({
      bucket: r.bucket,
      revenueCents: toNum(r.revenueCents),
      orders: toNum(r.orders),
    }));
    res.json(out);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const topProducts = async (req, res) => {
  try {
    const { from, to } = parseRange(req.query);
    const limit = Math.min(100, Number(req.query.limit || 10));

    const rows = await prisma.$queryRaw`
      SELECT oi.productId, p.name,
             SUM(oi.qty) AS units,
             SUM(oi.unitPriceCents * oi.qty) AS revenueCents
      FROM orderitem oi
      JOIN \`order\` o ON o.id = oi.orderId
      JOIN product p ON p.id = oi.productId
      WHERE o.paymentStatus='PAID' AND o.createdAt BETWEEN ${from} AND ${to}
      GROUP BY oi.productId, p.name
      ORDER BY revenueCents DESC
      LIMIT ${limit};
    `;

    const out = rows.map(r => ({
      productId: r.productId,
      name: r.name,
      units: toNum(r.units),
      revenueCents: toNum(r.revenueCents),
    }));
    res.json(out);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = { revenue, topProducts };
