import { AppError } from "@/helpers/error";
import type { Request } from "express";
import { StatusCodes } from "http-status-codes";

export interface TokenPayload {
  userId: string;
  // email: string;
  // role: string;
}

export const getAccessToken = (req: Request) => {
  const accessToken =
    (req.headers.authorization?.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null) || (req.headers["x-access-token"] as string);

  if (!accessToken) {
    throw new AppError("Access token is required", StatusCodes.BAD_REQUEST);
  }

  return accessToken;
};

export const getRefreshToken = (req: Request) => {
  const refreshToken =
    (req.cookies["refreshToken"] as string) ||
    (req.headers["x-refresh-token"] as string);

  if (!refreshToken) {
    throw new AppError("Refresh token is required", StatusCodes.BAD_REQUEST);
  }

  return refreshToken;
};

import jwt from "jsonwebtoken";
import { AUTH } from "@/constants";

/**
 * Generate access and refresh tokens
 */
export function generateTokens(userId: string): {
  accessToken: string;
  refreshToken: string;
} {
  const accessToken = jwt.sign({ userId }, AUTH.ACCESS_TOKEN_SECRET, {
    expiresIn: AUTH.ACCESS_TOKEN_EXPIRY,
    algorithm: "HS256",
  });

  const refreshToken = jwt.sign({ userId }, AUTH.REFRESH_TOKEN_SECRET, {
    expiresIn: AUTH.REFRESH_TOKEN_EXPIRY,
    algorithm: "HS256",
  });

  return { accessToken, refreshToken };
}

export const verifyAccessToken = (accessToken: string) => {
  const decoded = jwt.verify(accessToken, AUTH.ACCESS_TOKEN_SECRET, {
    algorithms: ["HS256"],
  });
  return decoded as TokenPayload;
};

export const verifyRefreshToken = (refreshToken: string) => {
  const decoded = jwt.verify(refreshToken, AUTH.REFRESH_TOKEN_SECRET, {
    algorithms: ["HS256"],
  });
  return decoded as TokenPayload;
};
