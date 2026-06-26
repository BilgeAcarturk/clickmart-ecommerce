const prisma = require("../config/prisma");

exports.list = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const take = Math.min(50, parseInt(req.query.take) || 10);
  const skip = (page - 1) * take;
  const search = (req.query.search || "").trim();
  const active = req.query.active; 

 const where = {
    ...(search && { name: { contains: search } }), 
    ...(active === "true" ? { isActive: true } : active === "false" ? { isActive: false } : {})
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({ where, skip, take, orderBy: { id: "desc" } }),
    prisma.product.count({ where })
  ]);
  res.json({ items, total, page, take });
};

exports.create = async (req, res) => {
  const { name, price, imageUrl, stock = 0, isActive = true } = req.body;
  if (!name || price == null) return res.status(400).json({ error: "name_price_required" });
  const p = await prisma.product.create({ data: { name, price: Number(price), imageUrl, stock: Number(stock), isActive } });
  res.status(201).json(p);
};

exports.update = async (req, res) => {
  const id = Number(req.params.id);
  const { name, price, imageUrl, stock, isActive } = req.body;
  const p = await prisma.product.update({ where: { id }, data: { name, price, imageUrl, stock, isActive } });
  res.json(p);
};

exports.remove = async (req, res) => {
  const id = Number(req.params.id);
  await prisma.product.delete({ where: { id } });
  res.json({ ok: true });
};

exports.toggle = async (req, res) => {
  const id = Number(req.params.id);
  const cur = await prisma.product.findUnique({ where: { id } });
  const p = await prisma.product.update({ where: { id }, data: { isActive: !cur.isActive } });
  res.json(p);
};
