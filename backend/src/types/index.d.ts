import { Request } from "express";

declare global {
  namespace Express {
    export interface Request {
      clientType?: "mobile" | "web";
    }
  }
}

export interface CustomRequest extends Request {
  clientType?: "mobile" | "web";
}
