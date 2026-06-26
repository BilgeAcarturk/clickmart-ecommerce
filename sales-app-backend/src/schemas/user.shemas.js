const z = require("zod");

const ListUsersQuery = z.object({
  q: z.string().trim().optional().default(""),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  role: z.enum(["admin", "staff", "customer"]).optional(),
});

const IdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const UpdateRoleBody = z.object({
  role: z.enum(["admin", "staff", "customer"]),
});

module.exports = { ListUsersQuery, IdParamSchema, UpdateRoleBody };
