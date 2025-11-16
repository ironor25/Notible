import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    userId?: number;
}

export function authMiddleware(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).json({ message: "Missing Authorization header" });
        }

        // Expecting: Authorization: Bearer <token>
        const parts = authHeader.split(" ");

        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({ message: "Invalid Authorization format" });
        }

        const token = parts[1];

        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET missing in environment variables");
        }
        if (!token ) return new Error("JWT_SECRET missing in environment variables");
        const decoded : any = jwt.verify(token, JWT_SECRET)
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}
