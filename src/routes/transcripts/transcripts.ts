import { Request, Response } from "express";
import { ROUTER } from "../../router";
import fs from "fs";
import { verifyToken } from "../../helpers/jwt";

export class Index {
    @ROUTER("GET", "/transcripts")
    async index(req: Request, res: Response) {
        const page = parseInt(req.query.page as string);
        const size = parseInt(req.query.size as string);
        const search = req.query.search as string;
        const type = req.query.type as string;
        let token = req.headers.authorization;

        if (token && token.startsWith("Bearer ")) {
            token = token.slice(7, token.length);
        } else {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!page || !size) {
            return res.status(400).json({ message: "Invalid query parameters" });
        }

        if (isNaN(page) || isNaN(size)) {
            return res.status(400).json({ message: "Invalid query parameters" });
        }

        if (page < 1 || size < 1) {
            return res.status(400).json({ message: "Invalid query parameters" });
        }

        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!decoded.isModerator) {
            return res.status(403).json({ message: "Forbidden" });
        }

        if (decoded.exp < Date.now() / 1000) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const start = (page - 1) * size;
        const end = start + size;

        const info = JSON.parse(fs.readFileSync("./db/info.json", "utf-8"));

        if (search) {
            info.tickets = info.tickets.filter((ticket: any) => {
                return ticket.username.toLowerCase().includes(search.toLowerCase());
            });
        }
        
        if (type) {
            console.log(type);
            info.tickets = info.tickets.filter((ticket: any) => {
                return ticket.type === type;
            });
        }

        const transcripts = info.tickets.slice(start, end);

        const pagesLeft = Math.ceil(info.total / size) - page;

        const totalPages = Math.ceil(info.total / size);

        res.json({ transcripts, total: info.total, totalPages, pagesLeft });
    }
}