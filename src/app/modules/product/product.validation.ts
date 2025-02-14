import { z } from 'zod';

const createProductValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Product name is required",
    }).min(1, "Product name cannot be empty"),
    description: z.string({
      required_error: "Product description is required",
    }).min(1, "Product description cannot be empty"),
    price: z.number({
      required_error: "Product price is required",
    }).min(0, "Product price cannot be less than 0"),
    stock: z.number({
      required_error: "Product stock is required",
    }).min(0, "Product stock cannot be less than 0"),
    weight: z.number().min(0, "Weight cannot be less than 0").nullable().optional(),
    offer: z.number().min(0, "Offer cannot be less than 0").optional().default(0),
    category: z.string({
      required_error: "Category ID is required",
    }).min(1, "Category ID cannot be empty")
  })
});

const updateProductValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Product name cannot be empty").optional(),
    description: z.string().min(1, "Product description cannot be empty").optional(),
    price: z.number().min(0, "Product price cannot be less than 0").optional(),
    stock: z.number().min(0, "Product stock cannot be less than 0").optional(),
    weight: z.number().min(0, "Weight cannot be less than 0").nullable().optional(),
    offer: z.number().min(0, "Offer cannot be less than 0").optional(),
    category: z.string().min(1, "Category ID cannot be empty").optional(),
  })
});

export const productValidation = {
  createProductValidationSchema,
  updateProductValidationSchema
}

