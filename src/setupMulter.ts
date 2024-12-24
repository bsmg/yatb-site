import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({ storage: storage, limits: { fieldSize: 20 * 1024 * 1024 }});

export const uploadMiddleware = upload.fields([
    { name: "file", maxCount: 1 },
]);