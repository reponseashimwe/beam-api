// lib/cloudinary.ts

import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import VARIABLES from "./config";

// Cloudinary configuration
cloudinary.config({
  api_key: VARIABLES.CLOUDINARY_API_KEY,
  api_secret: VARIABLES.CLOUDINARY_API_SECRET,
  cloud_name: VARIABLES.CLOUD_NAME,
});

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req: Request, file: Express.Multer.File) => ({
    public_id: `${uuidv4()}-${file.originalname}`,
    folder: "beam",
  }),
});

// Create multer instance with Cloudinary storage
const CloudinaryUpload = multer({ storage: storage });

export default CloudinaryUpload;
export { cloudinary };
