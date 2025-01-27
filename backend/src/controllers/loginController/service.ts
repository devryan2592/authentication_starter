import bcrypt from "bcryptjs";
import { prisma } from "@/utils/db";
import { AppError } from "@/helpers/error";
import { StatusCodes } from "http-status-codes";
import { generateTokens } from "@/services/generateTokens";
import type { User, Session, RefreshToken } from "@prisma/client";

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
  existingRefreshToken?: string
) => {
  const user = await validateCredentials(email, password);

  return await createAndSendTokens(user.id, existingRefreshToken);
};

// Create and send tokens with session
export const createAndSendTokens = async (
  userId: string,
  existingRefreshToken?: string
): Promise<{
  session: Session & {
    refreshToken: RefreshToken | null;
    user: Omit<User, "password">;
  };
  accessToken: string;
}> => {
  console.log("existingRefreshToken", existingRefreshToken);
  // First we generate tokens
  const { accessToken, refreshToken } = await generateTokens(userId);

  let session:
    | (Session & {
        refreshToken: RefreshToken | null;
        user: Omit<User, "password">;
      })
    | null = null;

  if (existingRefreshToken) {
    // We find and update the session with the new refresh token
    const existingSession = await prisma.session.findFirst({
      where: {
        userId,
        refreshToken: { token: existingRefreshToken },
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
        include: {
          refreshToken: true,
          user: true,
        },
      });
    }
  } else {
    // IF no existing refresh token, we find session by user Ip and device
  }

  // If no session, we create a new one
  if (!session) {
    session = await prisma.session.create({
      data: {
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        refreshToken: {
          create: {
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        },
      },
      include: {
        refreshToken: true,
        user: true,
      },
    });
  }

  return { session, accessToken };
};
