import type { Request, Response } from "express";
import { catchAsync } from "@/helpers/catchAsync";
import { StatusCodes } from "http-status-codes";
import { loginSchema } from "./schema";
import { handleLogin } from "./service";
import { UAParser } from "ua-parser-js";
import { AppError } from "@/helpers/error";

/*
Login flow:
1. User sends email and password to login
2. First the request passes through middleware to check Client Type (Mobile / Web, etc)
3. We check if the user exists in the database
4. If the user exists, we check if the password is correct
5. If the password is correct, we generate a session token and refresh token
6. Based on the client type, we return the refresh token and access token to the user (either in cookies or in response body )
*/

// Session: (Based on client IP)
// 1. Refresh Token
// 2. Access Token
// 3. User

export const loginController = catchAsync(
  async (req: Request, res: Response) => {
    const validatedRequest = loginSchema.parse(req.body);
    const { email, password } = validatedRequest;

    // From middleware
    const clientType = req.clientType || "web";

    // Client IP
    const clientIp = req.ip || req.socket?.remoteAddress || "";

    const userAgent = UAParser(req.headers["user-agent"]);

    const result = await handleLogin(
      email,
      password,
      clientType,
      clientIp.toString(),
      userAgent
    );

    if (!result) {
      throw new AppError("Failed to login", StatusCodes.INTERNAL_SERVER_ERROR);
    }

    //  IF CLIENT TYPE IS WEB
    if (clientType === "web") {
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 5 * 60 * 1000, // 5 minutes
      });
    }

    const response = {
      success: true,
      message: "User logged in successfully",
      data: {
        user: result.user,
        session: result.session,
        accessToken: result.accessToken,
        ...(clientType === "mobile" && {
          refreshToken: result.refreshToken,
        }),
      },
    };

    return res.status(StatusCodes.OK).json(response);
  }
);
