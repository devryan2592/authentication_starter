import type { Response, NextFunction } from "express";
import type { CustomRequest } from "@/types";
import { StatusCodes } from "http-status-codes";
import { AppError } from "@/helpers/error";

const clientTypeMiddleware = (
  req: CustomRequest,
  _: Response,
  next: NextFunction
) => {
  const clientType = req.headers["client-type"] as string;

  if (!clientType) {
    return next(
      new AppError("Client type is required", StatusCodes.BAD_REQUEST)
    );
  }

  //  Check if the client type is valid
  if (!["mobile", "web"].includes(clientType)) {
    return next(new AppError("Invalid client type", StatusCodes.BAD_REQUEST));
  }

  req.clientType = clientType as "mobile" | "web";
  next();
};

export default clientTypeMiddleware;
