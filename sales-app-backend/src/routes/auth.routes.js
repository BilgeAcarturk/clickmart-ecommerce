const r = require("express").Router();
const c = require("../controllers/auth.controller");

r.post("/register", c.register);
r.post("/login", c.login);
r.post("/forgot-password", c.forgot);
r.post("/reset-password", c.reset);

module.exports = r;
