import multer from "multer";
import { AppError } from "./error.js";

const multerStorage = multer.memoryStorage();

const multerFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError(400, "NOT_AN_IMAGE_PLEASE_UPLOAD_ONLY_IMAGES"), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserPhoto = upload.single("imageUrl");
export const uploadProductImages = upload.array("images", 10);
