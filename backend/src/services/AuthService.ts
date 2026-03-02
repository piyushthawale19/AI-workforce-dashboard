import { UserRepository } from "../repositories/UserRepository";
import { LoginDTO, RegisterDTO, AuthResponse } from "../types";
import { hashPassword, comparePassword } from "../utils/crypto";
import { generateToken } from "../utils/jwt";
import { AppError } from "../middleware/errorHandler";

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(data: RegisterDTO): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError(400, "User already exists");
    }

    const passwordHash = await hashPassword(data.password);

    const user = await this.userRepository.create({
      email: data.email,
      passwordHash,
      role: data.role || "viewer",
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new AppError(401, "Invalid credentials");
    }

    const isValid = await comparePassword(data.password, user.passwordHash);

    if (!isValid) {
      throw new AppError(401, "Invalid credentials");
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
