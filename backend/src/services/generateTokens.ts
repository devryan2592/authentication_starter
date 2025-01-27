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
