import jwt from "jsonwebtoken";
import { config } from "../config";

export const generateToken = (payload: {
  userId: number;
  email: string;
  role: string;
}): string => {
  return jwt.sign(
    payload,
    config.jwt.secret as string,
    { expiresIn: config.jwt.expiresIn as string } as any,
  );
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, config.jwt.secret as string);
  } catch (error) {
    return null;
  }
};
