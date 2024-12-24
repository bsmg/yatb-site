import { Request, Response } from "express";
import { ROUTER } from "../../router";
import querystring from "querystring";
import { generateToken } from "../../helpers/jwt";

export class Verify {
    @ROUTER("GET", "/login")
    async login(req: Request, res: Response) {
        res.redirect(`https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_ID}&response_type=code&redirect_uri=${process.env.REDIRECT_URI}/discord&scope=guilds.members.read`)
    }

    @ROUTER("GET", "/discord")
    async discord(req: Request, res: Response) {
        const code = req.query.code.toString();

        if (!code) {
            return res.status(400).send("No code provided");
        }

        const response = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: querystring.stringify({
                grant_type: "authorization_code",
                code: code,
                client_secret: process.env.DISCORD_SECRET,
                client_id: process.env.DISCORD_ID,
                redirect_uri: `${process.env.REDIRECT_URI}/discord`,
            }),
        });

        if (response.status !== 200) {
            return res.status(500).send("Failed to fetch the token");
        }

        const data = await response.json() as { access_token: string, token_type: string, expires_in: number, refresh_token: string, scope: string };
        const token = data.access_token;

        const user = await fetch("https://discord.com/api/users/@me/guilds/1243741807955677214/member", {
            method: "GET",
            headers: {
                authorization: `Bearer ${token}`,
            },
        });

        if (user.status !== 200) {
            return res.status(500).send("Error getting user.");
        }

        const userData = await user.json() as any;

        const modRoles = process.env.MOD_ROLES.split(",");

        for (let i = 0; i < modRoles.length; i++) {
            if (userData.roles.includes(modRoles[i])) {
                const token = generateToken(true);
                return res.redirect(`http://localhost:3000/?token=${token}`);
            }
        }

        return res.send("You are not a moderator.");
    }
}