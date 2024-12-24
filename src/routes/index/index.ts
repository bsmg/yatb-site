import { Request, Response } from "express";
import { ROUTER } from "../../router";
import fs from "fs";

export class Index {
    @ROUTER("GET", "/")
    async index(req: Request, res: Response) {
        const html = fs.readFileSync("./index.html", "utf-8");
        res.send(html);
    }
}