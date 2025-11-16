import express, { Router } from "express";
import rateLimit from "express-rate-limit";
import asyncHandler from "../utils/asyncHandler.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const generate_router : Router  = express.Router();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) console.warn("GEMINI_API_KEY missing in env for /generate route");

const genAI = new GoogleGenAI({ apiKey });

// stricter rate-limit for costly AI calls
const genLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: Number(10), // per-user IP per hour
  message: { message: "Rate limit reached for /generate" }
});

generate_router.post("/", genLimiter, asyncHandler(async (req, res) => {
  const prompt = String(req.body.prompt || "").trim();
  if (!prompt) return res.status(400).json({ message: "Prompt required" });
  
  //checking length of prompt to prevent from token limit.
  if (prompt.length > 3000) return res.status(400).json({ message: "Prompt too long" });

  const response = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${prompt}`,
  });
  console.log("prompt reached")
  res.json({ result: response.text });
}));

export default generate_router;
