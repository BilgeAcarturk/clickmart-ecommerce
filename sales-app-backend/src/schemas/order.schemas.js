const { z } = require("zod");

const PaymentMethod = z.enum(["COD","TRANSFER","CARD"]);
const AddressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().regex(/^\+?\d{10,14}$/),
  address1: z.string().min(5),
  address2: z.string().optional().nullable(),
  city: z.string().min(2),
  district: z.string().min(2),
  postalCode: z.string().min(3).max(10),
});

const CreateOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.number().int().positive(),
    qty: z.number().int().min(1).max(99),
  })).min(1).max(100),
  paymentMethod: PaymentMethod,
  shippingAddress: AddressSchema,
});

const ListOrdersQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(["PENDING","CONFIRMED","SHIPPED","DELIVERED","CANCELED"]).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
}).refine(q => !(q.from && q.to) || q.from <= q.to, { path:["from"], message:"from must be <= to" });

module.exports = { CreateOrderSchema, ListOrdersQuery };
