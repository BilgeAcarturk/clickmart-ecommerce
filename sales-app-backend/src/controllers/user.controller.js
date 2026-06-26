const prisma = require("../config/prisma");

// GET /api/users
exports.listUsers = async (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1));
  const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize || 10)));
  const q = String(req.query.q || "").trim();

  const where = q ? {
    OR: [
      { name:  { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ],
  } : {};

  const [total, data] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: { id:true, name:true, email:true, role:true, createdAt:true },
    }),
  ]);

  res.json({ data, meta: { page, pageSize, total, pageCount: Math.max(1, Math.ceil(total/pageSize)) } });
};

// PATCH /api/users/:id/role
exports.updateUserRole = async (req, res) => {
  const id = Number(req.params.id);
  const role = String(req.body.role || "").toLowerCase();
  if (!["admin","staff","customer"].includes(role))
    return res.status(400).json({ error: "invalid_role" });
  if (req.user.id === id)
    return res.status(400).json({ error: "cannot_change_self_role" });

  const user = await prisma.user.update({
    where: { id },
    data: { role },
    select: { id:true, name:true, email:true, role:true },
  });
  res.json(user);
};

// DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  const id = Number(req.params.id);
  if (req.user.id === id) return res.status(400).json({ error: "cannot_delete_self" });

  const hasOrders = await prisma.order.count({ where: { userId: id } });
  if (hasOrders) return res.status(409).json({ error: "user_has_orders" });

  await prisma.user.delete({ where: { id } });
  res.json({ ok: true });
};
