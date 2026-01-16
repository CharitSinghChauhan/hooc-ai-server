import app from "./app";
import { connectDB } from "./db/config";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 8080;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log("Server running 8080");
    });
  } catch (error) {
    console.error("Failed to connect to database or server:", error);
    process.exit(1);
  }
})();
