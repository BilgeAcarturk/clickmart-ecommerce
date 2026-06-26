const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const h = req.headers.authorization || "";
  const t = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!t) return res.status(401).json({ error: "no_token" });
  try {
    const p = jwt.verify(t, process.env.JWT_SECRET);
    req.user = { id: p.sub, role: p.role };
    next();
  } catch {
    return res.status(401).json({ error: "invalid_token" });
  }
};

exports.requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ error: "forbidden" });
  next();
};
