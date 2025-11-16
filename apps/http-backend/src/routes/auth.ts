import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { CreateUserSchema, SigninSchema } from "@repo/common/types"; // keep your zod schemas
import { prismaClient } from "@repo/db/client";
import asyncHandler from "../utils/asyncHandler";
import dotenv from "dotenv";
dotenv.config();

const auth_router: express.Router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET required");


//this rate limiter

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10, // 10 requests per minute for auth endpoints
  message: { message: "Too many attempts, try again later" }
});


//signup auth route

auth_router.post("/signup", authLimiter, asyncHandler(async (req : any, res: any) => {
  const parsed = CreateUserSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Incorrect inputs" });
  }
  const { username: email, password, name } = parsed.data;

  // check existing
  const existing = await prismaClient.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ message: "User already exists" });

  const rounds = Number(process.env.BCRYPT_ROUNDS || 12);
  const hashed = await bcrypt.hash(password, rounds);

  const user = await prismaClient.user.create({
    data: { email, password: hashed, name }
  });

  res.status(201).json({ uid: user.id });
}));

//sigin  route

auth_router.post("/signin", authLimiter, asyncHandler(async (req : any, res: any) => {

  const parsed = SigninSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Incorrect inputs" });

  const { username: email, password } = parsed.data;
  const user = await prismaClient.user.findUnique({ where: {"email": email } });
  
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id },JWT_SECRET, { expiresIn: '1D' });

  res.json({ token });
}));

export default auth_router;
