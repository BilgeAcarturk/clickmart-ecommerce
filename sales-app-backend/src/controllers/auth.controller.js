const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mailer = require("../config/mailer"); 

const sign = (u) => jwt.sign({ sub: u.id, role: u.role }, process.env.JWT_SECRET, { expiresIn: "2h" });
const front = process.env.FRONT_URL || "http://localhost:5173";

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const exist = await prisma.user.findUnique({ where: { email } });
  if (exist) return res.status(409).json({ error: "email_exists" });
  const hash = await bcrypt.hash(password, 10);
  const u = await prisma.user.create({ data: { name, email, passwordHash: hash } });
  res.status(201).json({ id: u.id, name: u.name, email: u.email, role: u.role });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const u = await prisma.user.findUnique({ where: { email } });
  if (!u || !(await bcrypt.compare(password, u.passwordHash)))
    return res.status(401).json({ error: "invalid_credentials" });
  res.json({ token: sign(u), user: { id: u.id, name: u.name, role: u.role, email: u.email } });
};



exports.forgot = async (req, res) => {
  const { email } = req.body;
  const u = await prisma.user.findUnique({ where: { email } });
  if (!u) return res.json({ ok: true });

  const token = crypto.randomBytes(20).toString("hex");
  const exp = new Date(Date.now() + 60 * 60 * 1000);
  await prisma.user.update({
    where: { id: u.id },
    data: { resetToken: token, resetTokenExp: exp },
  });

  const url = `${front}/reset-password?token=${token}`;
  await mailer.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Reset your ClickMart password",
    text: `Use this link to reset: ${url}`,
    html: `<p>Click to reset:</p><p><a href="${url}">${url}</a></p><p>Valid for 1 hour.</p>`,
  });

  res.json({ ok: true });
};

exports.reset = async (req, res) => {
  const { token = "", newPassword } = req.body;
  console.log("RESET body:", req.body);

  const u = await prisma.user.findFirst({ where: { resetToken: token.trim() } });
  if (!u) return res.status(400).json({ error: "invalid_token" });

  if (u.resetTokenExp <= new Date()) {
    return res.status(400).json({ error: "expired_token" });
  }

  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: u.id },
    data: { passwordHash: hash, resetToken: null, resetTokenExp: null },
  });
  res.json({ ok: true });
};