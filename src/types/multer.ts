import { Request } from "express";

interface MulterFile {
    file?: Express.Multer.File[];
}

// @ts-ignore
export interface TypedRequest extends Request {
    files?: MulterFile;
}