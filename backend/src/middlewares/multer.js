import multer, { diskStorage } from "multer";

const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const prefix = Date.now();
    cb(null, prefix + "-" + file.originalname);
  },
});

const upload = multer({ storage, limits: { fileSize: 3 * 1024 * 1024 } });
export default upload;
