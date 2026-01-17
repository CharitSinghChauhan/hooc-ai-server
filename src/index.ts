import app from "./app";
import { connectDB } from "./db/config";
import dotenv from "dotenv";
import type { VercelRequest, VercelResponse } from "@vercel/node";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 8080;

export default async (req: VercelRequest, res: VercelResponse) => {
  await connectDB();
  return app(req, res);
};
