import { Request, Response } from "express";
import { ROUTER } from "../../router";
import fs from "fs";
import { verifyToken } from "../../helpers/jwt";

export class Index {
    @ROUTER("GET", "/transcript/:ticket")
    async index(req: Request, res: Response) {
        const cookies = req.cookies;

        if (!cookies.token) {
            return res.status(401).json({ message: "Unauthorized" });
        } else {
            const decoded = verifyToken(cookies.token);

            if (!decoded) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            if (decoded.exp < Date.now() / 1000) {
                return res.status(401).json({ message: "Unauthorized" });
            }
        }

        const ticket = req.params.ticket;
        const html = fs.readFileSync(`./db/transcripts/transcript-${ticket}.html`, "utf-8");
        res.send(html);
    }
}