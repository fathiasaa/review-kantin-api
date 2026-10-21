
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/userRepository.ts';
import { AppError } from '../errors/AppError.ts';

export class AuthService {
  private userRepository = new UserRepository();

  async register(input: {
    name: string;
    email: string;
    password: string;
  }) {
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new AppError(409, 'Email sudah terdaftar');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    return this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: 'customer',
    });
  }

  async login(input: {
    email: string;
    password: string;
  }) {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new AppError(401, 'Email atau password salah');
    }

    const passwordValid = await bcrypt.compare(
      input.password,
      user.passwordHash
    );

    if (!passwordValid) {
      throw new AppError(401, 'Email atau password salah');
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET belum dikonfigurasi');
    }

    const token = jwt.sign(
      {
        sub: String(user.id),
        role: user.role,
      },
      secret,
      { expiresIn: '1h' }
    );

    return {
      token,
      tokenType: 'Bearer',
    };
  }

  async getMe(userId: number) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError(401, 'Pengguna tidak ditemukan');
    }

    return user;
  }
}
