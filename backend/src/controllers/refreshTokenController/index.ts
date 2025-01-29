import type { Request, Response } from "express";
import { catchAsync } from "@/helpers/catchAsync";
import { getRefreshToken } from "@/services/tokenService";
import { UAParser } from "ua-parser-js";
import { refreshTokenService } from "./service";
import { StatusCodes } from "http-status-codes";

/*
Refresh token flow:
1. Check if the refresh token is valid.
2. Check if the refresh token is reused.
3. If all checks pass, create a new access token and refresh token.
4. Send the new access token and refresh token to the client.
*/
export const refreshTokenController = catchAsync(
  async (req: Request, res: Response) => {
    const refreshToken = getRefreshToken(req);
    // From middleware
    const clientType = req.clientType || "web";

    // Client IP
    const clientIp = req.ip || req.socket?.remoteAddress || "";

    const userAgent = UAParser(req.headers["user-agent"]);

    const { accessToken, refreshToken: newRefreshToken } =
      await refreshTokenService(refreshToken, clientType, clientIp, userAgent);

    //  IF CLIENT TYPE IS WEB
    if (clientType === "web") {
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 5 * 60 * 1000, // 5 minutes
      });
    }

    const response = {
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken: accessToken,
        ...(clientType === "mobile" && {
          refreshToken: newRefreshToken,
        }),
      },
    };

    return res.status(StatusCodes.OK).json(response);
  }
);
