import z from "zod";

export const CATEGORY_NAME_VALIDATOR = z
  .string()
  .min(1, "Category name is required")
  .regex(
    /^[a-zA-Z0-9-]+$/,
    "Category name can only contain letters, numbers or hypens"
  );

export const CATEGORY_COLOR_VALIDATOR = z
  .string()
  .min(1, "Color is required")
  .regex(/^#[0-9A-F]{6}$/i, "Invalid color format");

export const CATEGORY_EMOJI_VALIDATOR = z.string().emoji("Invalid emoji");
