import bcrypt from "bcryptjs";
import { prisma } from "@/utils/db";
import { AppError } from "@/helpers/error";
import { StatusCodes } from "http-status-codes";
import { SessionAndTokensResponse } from "./type";
import { generateTokens } from "@/services/tokenService";

/**
 * Validate user credentials and handle initial login
 */

export const validateCredentials = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: {
      id: true,
      email: true,
      password: true,
    },
  });

  if (!user)
    throw new AppError("Invalid credentials", StatusCodes.UNAUTHORIZED);

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid)
    throw new AppError("Invalid credentials", StatusCodes.UNAUTHORIZED);

  return user;
};

// Later: Handle intial login with 2FA

// Later Complete the login process with 2FA

// Login without 2FA
export const handleLogin = async (
  email: string,
  password: string,
  clientType: string,
  clientIp: string,
  userAgent: UAParser.IResult
) => {
  const user = await validateCredentials(email, password);

  if (!user) {
    throw new AppError("Invalid credentials", StatusCodes.UNAUTHORIZED);
  }

  const { session, accessToken, refreshToken } = await createSessionAndTokens(
    user.id,
    clientIp,
    clientType,
    userAgent
  );

  if (!session) {
    throw new AppError(
      "Failed to create session",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  if (!accessToken || !refreshToken) {
    throw new AppError(
      "Failed to generate tokens",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  return { user, session, accessToken, refreshToken };
};

// Create and send tokens with session
export const createSessionAndTokens = async (
  userId: string,
  clientIp: string,
  clientType: string,
  userAgent: UAParser.IResult
): Promise<SessionAndTokensResponse> => {
  // First we generate tokens
  const { accessToken, refreshToken } = await generateTokens(userId);

  let session;

  if (clientIp && clientIp !== "" && clientType && clientType !== "") {
    // We find and update the session with the ip address and client type
    const existingSession = await prisma.session.findFirst({
      where: {
        userId,
        clientIp,
        clientType,
      },
    });

    if (existingSession) {
      session = await prisma.session.update({
        where: { id: existingSession.id },
        data: {
          refreshToken: {
            update: {
              token: refreshToken,
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          },
        },
      });
    }
  }

  // If no session, we create a new one
  if (!session) {
    session = await prisma.session.create({
      data: {
        userId,
        clientIp,
        clientType,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        refreshToken: {
          create: {
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        },
        userAgent: {
          create: {
            userAgent: userAgent.ua,
            browser: userAgent.browser.name,
            os: userAgent.os.name,
            device: userAgent.device.type,
            engine: userAgent.engine.name,
          },
        },
      },
    });
  }

  return { session, accessToken, refreshToken };
};
