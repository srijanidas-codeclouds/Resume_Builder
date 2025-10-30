import * as yup from "yup";

export const userSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters long")
    .required("Name is required"),

  email: yup
    .string()
    .trim()
    .email("Invalid email format. Please enter a valid email address (e.g. user@example.com)")
    .required("Email is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters long")
    .required("Password is required"),
}).noUnknown(true, "Unknown fields are not allowed");

export const validateUser = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (err) {
    return res.status(400).json({ errors: err.errors });
  }
};
