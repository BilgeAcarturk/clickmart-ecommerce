require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");

const app = express();

const ALLOWED_ORIGINS = [
  process.env.FRONT_URL || "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);           
    cb(null, ALLOWED_ORIGINS.includes(origin));
  },
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true,
}));

app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", require("./routes/auth.routes.js"));
app.use("/api/products", require("./routes/product.routes.js"));
app.use("/api", require("./routes/order.routes.js"));
app.use("/api", require("./routes/user.routes.js"));
app.use("/api/reports", require("./routes/report.routes.js"));

const server = http.createServer(app);
try { require("./config/io.js").init(server); } catch {}

const port = process.env.PORT || 4000;
server.listen(port, () => console.log("API on", port));

app.use((err, req, res, next) => {
  const status = err.status || 400;
  const message = err.message || "Bad Request";
  res.status(status).json({ message, stack: process.env.NODE_ENV === "production" ? undefined : err.stack });
});
