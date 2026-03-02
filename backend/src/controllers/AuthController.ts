import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService";
import { validateData, loginSchema, registerSchema } from "../utils/validation";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = validateData(registerSchema, req.body);
      const result = await this.authService.register(validatedData);

      res.status(201).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = validateData(loginSchema, req.body);
      const result = await this.authService.login(validatedData);

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
