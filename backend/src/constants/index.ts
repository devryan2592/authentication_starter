export const ENVIRONMENT = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  TEST: "test",
  CURRENT: process.env.NODE_ENV || "development",
} as const;

export const CLIENT_URLS = {
  DEVELOPMENT: {
    NEXT: process.env.CLIENT_URL || "http://localhost:3000",
    EXPO: process.env.EXPO_URL || "http://localhost:19006",
    EXPO_ALTERNATIVE: "exp://localhost:19006",
    VITE: process.env.VITE_URL || "http://localhost:5173",
  },
  PRODUCTION: {
    CLIENT: process.env.PRODUCTION_CLIENT_URL,
    API: process.env.PRODUCTION_API_URL,
  },
} as const;

export const AUTH = {
  ACCESS_TOKEN_EXPIRY: "1h",
  REFRESH_TOKEN_EXPIRY: "7d",
  ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET!,
  REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET!,
} as const;
