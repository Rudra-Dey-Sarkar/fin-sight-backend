import { z } from "zod";

const RECORD_TYPES = ["income", "expense"];

const isValidDateString = (value) => {
  return !Number.isNaN(new Date(value).getTime());
};

const emptyStringToUndefined = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmedValue = value.trim();
  return trimmedValue === "" ? undefined : trimmedValue;
};

const dateSchema = z.string().refine(isValidDateString, "Invalid date");

const createRecordSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  type: z.enum(RECORD_TYPES),
  category: z.string().trim().min(1, "Category is required").max(100),
  date: dateSchema,
  notes: z.string().trim().max(500).optional()
});

const updateRecordSchema = z
  .object({
    amount: z.coerce.number().positive("Amount must be greater than zero").optional(),
    type: z.enum(RECORD_TYPES).optional(),
    category: z.string().trim().min(1).max(100).optional(),
    date: dateSchema.optional(),
    notes: z.string().trim().max(500).optional()
  })
  .refine(
    (value) =>
      value.amount !== undefined ||
      value.type !== undefined ||
      value.category !== undefined ||
      value.date !== undefined ||
      value.notes !== undefined,
    {
      message: "At least one field is required"
    }
  );

const listRecordsQuerySchema = z
  .object({
    dateFrom: z.preprocess(emptyStringToUndefined, dateSchema.optional()),
    dateTo: z.preprocess(emptyStringToUndefined, dateSchema.optional()),
    type: z.preprocess(emptyStringToUndefined, z.enum(RECORD_TYPES).optional()),
    category: z.preprocess(
      emptyStringToUndefined,
      z.string().trim().min(1).max(100).optional()
    ),
    page: z.preprocess(
      emptyStringToUndefined,
      z.coerce.number().int().min(1).default(1)
    ),
    limit: z.preprocess(
      emptyStringToUndefined,
      z.coerce.number().int().min(1).max(100).default(10)
    )
  })
  .superRefine((value, ctx) => {
    if (value.dateFrom && value.dateTo && new Date(value.dateFrom) > new Date(value.dateTo)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dateFrom"],
        message: "dateFrom cannot be later than dateTo"
      });
    }
  });

const recordIdParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

export {
  createRecordSchema,
  updateRecordSchema,
  listRecordsQuerySchema,
  recordIdParamSchema
};
