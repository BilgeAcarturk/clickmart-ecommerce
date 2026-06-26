const r = require("express").Router();
const c = require("../controllers/product.controller");
const { auth, requireRole } = require("../middlewares/auth");

// Herkese açık listeleme
r.get("/", c.list);

// Personel korumalı işlemler
r.post("/", auth, requireRole("staff"), c.create);
r.put("/:id", auth, requireRole("staff"), c.update);
r.delete("/:id", auth, requireRole("staff"), c.remove);
r.patch("/:id/toggle", auth, requireRole("staff"), c.toggle);

module.exports = r;
