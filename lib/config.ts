import dotenv from "dotenv";

dotenv.config();

const VARIABLES = {
  PORT: process.env.PORT || 2023,

  JWT_TOKEN: process.env.JWT_TOKEN || "beam",
  EXPIRE: Number(process.env.EXPIRE) * 60 * 60 || 3600,
  CLOUD_NAME: process.env.CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
  FRONTEND_URL: process.env.FRONTEND_URL || "",
  MAILER_USERNAME: process.env.MAILER_USERNAME || "",
  MAILER_PASSWORD: process.env.MAILER_PASSWORD || "",
  MAILER_SERVICE: process.env.MAILER_SERVICE || "",
  LOGO_URL: process.env.LOGO_URL || "",
  APP_NAME: process.env.APP_NAME || "Beam",
  MAILER_NAME: process.env.MAILER_NAME || "",
  MAILER_PORT: process.env.MAILER_PORT || "",
  BACKEND_URL: process.env.BACKEND_URL || "http://localhost:3000/api",
};

export default VARIABLES;
