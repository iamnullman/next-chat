import { withIronSession } from "next-iron-session";

export default function withSession(app) {
    return withIronSession(app, {
        password: "bXlzcWxhc3N3b3JkMTIzNDU2Nzg5MA====",
        cookieName: "next-chat",
        cookieOptions: {
            secure: process.env.NODE_ENV === "production",
        }
    });
};