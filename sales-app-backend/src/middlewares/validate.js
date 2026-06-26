exports.validate = (schema, place = "body") => (req, res, next) => {
  if (!schema) return next();

  const pick = place === "query" ? "query" : place === "params" ? "params" : "body";
  const src = req[pick] ?? {};

  try {
    const parsed = schema.safeParse(src);
    if (!parsed.success) {
      const issues = parsed.error?.issues ?? [];
      return res.status(400).json({
        message: "Validation failed",
        issues: issues.map(i => ({ path: i.path, message: i.message })),
      });
    }
    req[pick] = parsed.data;
    next();
  } catch (e) {
    return res.status(400).json({ message: "Validation error", error: String(e) });
  }
};
