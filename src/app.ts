import express from "express";
import authRouter from "./route/auth-route";
import userRouter from "./route/user-route";
import cors from "cors";
import errorMiddleware from "./middleware/error-middleware";

const app = express();

const allowedOrigins = ["http://localhost:3000", process.env.FRONTEND_URL];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

app.use("/auth", authRouter);
app.use("/users", userRouter);

app.use(errorMiddleware);

export default app;
