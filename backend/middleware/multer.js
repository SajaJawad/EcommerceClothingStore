import multer from "multer";
import fs from "fs";

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, uploadDir);
    },
    filename: function (req, file, callback) {
        const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
        callback(null, uniqueName);
    },
});

const upload = multer({ storage });

export default upload;