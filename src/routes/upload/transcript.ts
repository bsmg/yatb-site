import { Response } from "express";
import { ROUTER } from "../../router";
import { uploadMiddleware } from "../../setupMulter";
import { TypedRequest } from "../../types/multer";
import fs from "fs";

export class Transcript {
    @ROUTER("POST", "/transcript", uploadMiddleware)
    async upload(req: TypedRequest, res: Response) {
        const json = req.body.jsonData ? JSON.parse(req.body.jsonData) : {};
        const file = req.files?.file ? (req.files.file as Express.Multer.File[])[0] : undefined;
        const auth = req.headers.authorization;

        if (auth !== process.env.AUTH_KEY) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!file) return res.status(400).json({ message: "No file uploaded" });

        const filePath = `./db/transcripts/${file.originalname}`;
        fs.writeFileSync(filePath, file.buffer);

        const info = JSON.parse(fs.readFileSync("./db/info.json", "utf-8"));

        info.tickets.unshift({ ...json });
        info.total = info.tickets.length;
        fs.writeFileSync("./db/info.json", JSON.stringify(info, null, 2));

        res.status(200).json({ message: "File uploaded" });
    }
}