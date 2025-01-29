import { UAParser } from "ua-parser-js";
import { AppError } from "@/helpers/error";
import { StatusCodes } from "http-status-codes";
import { generateTokens, verifyRefreshToken } from "@/services/tokenService";
import { prisma } from "@/utils/db";

export const refreshTokenService = async (
  refreshToken: string,
  clientType: string,
  clientIp: string,
  userAgent: UAParser.IResult
) => {
  // Check if the refresh token is valid

  const { userId } = verifyRefreshToken(refreshToken);

  if (!userId) {
    throw new AppError("Invalid refresh token", StatusCodes.UNAUTHORIZED);
  }

  //   Get session
  const session = await prisma.session.findFirst({
    where: {
      refreshToken: {
        token: refreshToken,
      },
    },
    include: {
      userAgent: true,
    },
  });

  if (!session) {
    throw new AppError("Invalid refresh token", StatusCodes.UNAUTHORIZED);
  }

  //   Check if session is expired
  if (session.expiresAt < new Date()) {
    throw new AppError("Session expired", StatusCodes.UNAUTHORIZED);
  }

  // Verify the client IP
  const isValidClient = session.clientIp === clientIp;

  if (!isValidClient) {
    throw new AppError("Invalid client", StatusCodes.UNAUTHORIZED);
  }

  //   Check if the user agent is valid
  const isValidUserAgent = session.userAgent?.userAgent === userAgent.ua;

  if (!isValidUserAgent) {
    throw new AppError("Invalid device", StatusCodes.UNAUTHORIZED);
  }

  //   Check if the client type is valid
  const isValidClientType = session.clientType === clientType;

  if (!isValidClientType) {
    throw new AppError("Invalid client type", StatusCodes.UNAUTHORIZED);
  }

  //   All Checks Passed

  //   Generate new tokens
  const { accessToken, refreshToken: newRefreshToken } = generateTokens(userId);

  // Update the session & refresh token
  await prisma.$transaction([
    prisma.refreshToken.update({
      where: { sessionId: session.id },
      data: {
        token: newRefreshToken,

        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    }),
    prisma.session.update({
      where: { id: session.id },
      data: { expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }, // 7 days
    }),
  ]);

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};
