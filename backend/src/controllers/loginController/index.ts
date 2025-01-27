import { Request, Response } from "express";
import { catchAsync } from "@/helpers/catchAsync";
import { StatusCodes } from "http-status-codes";
import { BaseLoginInput, MobileLoginInput } from "./schema";
import { handleLogin } from "./service";

export const handleMobileLogin = catchAsync(
  async (req: Request, res: Response) => {
    const { email, password, refreshToken } = req.body as MobileLoginInput;

    const result = await handleLogin(email, password, refreshToken);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "User logged in successfully",
      data: {
        user: result.session.user,
        accessToken: result.accessToken,
        refreshToken: result.session.refreshToken?.token,
      },
    });
  }
);

export const handleWebLogin = catchAsync(
  async (req: Request, res: Response) => {
    const { email, password } = req.body as BaseLoginInput;
    const refreshToken = req.cookies.refreshToken;

    const result = await handleLogin(email, password, refreshToken);

    res.cookie("refreshToken", result.session.refreshToken?.token, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 1 * 60 * 60 * 1000, // 1 hour
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "User logged in successfully",
      data: {
        user: result.session.user,
        accessToken: result.accessToken,
      },
    });
  }
);
