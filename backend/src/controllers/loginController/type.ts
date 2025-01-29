import type { User, Session } from "@prisma/client";

export interface SessionAndTokensResponse {
  session: Session;
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  session: Session;
  user: Omit<User, "password">;
  accessToken: string;
  refreshToken: string;
}
