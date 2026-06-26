const express = require("express");
const { auth, requireRole } = require("../middlewares/auth");
const { listUsers, updateUserRole, deleteUser } = require("../controllers/user.controller");

const r = express.Router();

r.get("/users", auth, requireRole("staff","admin"), listUsers);
r.patch("/users/:id/role", auth, requireRole("admin"), updateUserRole);
r.delete("/users/:id", auth, requireRole("admin"), deleteUser);

module.exports = r;
