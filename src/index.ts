import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { readdirSync } from "fs";
import { setupRoutes } from "./router";
import path from "path";
import cookieParser from "cookie-parser";
import fs from "fs";
const folders = readdirSync(path.join(__dirname, "routes"));
for (const folder of folders) {
    const files = readdirSync(path.join(__dirname, "routes", folder));
    for (const file of files) {
        if (file.endsWith(".ts") || file.endsWith(".js")) require(`./routes/${folder}/${file}`);
    }
}

if (!fs.existsSync("./db/transcripts")) {
    fs.mkdirSync("./db/transcripts", { recursive: true });
}

const app = express();

app.use(cookieParser());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true, parameterLimit: 10000 }));

app.disable("x-powered-by");

setupRoutes(app);

app.listen(3000, () => console.log("App listening on port 3000 | http://localhost:3000"));