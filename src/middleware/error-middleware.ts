import { Request, Response, NextFunction } from "express";

interface HttpException extends Error {
  status?: number;
  message: string;
}

const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";

  console.error(`[Error] ${status} - ${message}`);

  res.status(status).json({
    message,
    status,
  });
};

export default errorMiddleware;
