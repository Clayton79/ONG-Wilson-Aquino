import { userRepository } from '../repositories';
import { User, UserPublic, UserRole, AuthSession } from '../models';
import { RegisterInput, LoginInput } from '../models/schemas';
import { hashPassword, comparePassword, generateToken } from '../utils';

function toPublicUser(user: User): UserPublic {
  const { password: _password, ...publicUser } = user;
  return publicUser;
}

export class AuthService {
  async register(data: RegisterInput): Promise<AuthSession> {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new Error('Email já cadastrado');
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || UserRole.VISITOR,
      phone: data.phone,
      isActive: true,
    });

    const publicUser = toPublicUser(user);
    const token = generateToken(publicUser);

    return {
      user: publicUser,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  async login(data: LoginInput): Promise<AuthSession> {
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('Email ou senha inválidos');
    }

    const isValid = await comparePassword(data.password, user.password);
    if (!isValid) {
      throw new Error('Email ou senha inválidos');
    }

    if (!user.isActive) {
      throw new Error('Conta desativada. Contate o administrador.');
    }

    const publicUser = toPublicUser(user);
    const token = generateToken(publicUser);

    return {
      user: publicUser,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  async recover(email: string): Promise<{ message: string }> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      // Simulate same response for security
      return { message: 'Se o email existir, um link de recuperação será enviado.' };
    }

    // In a real app, this would send an email
    // For simulation purposes, we just return success
    return { message: 'Se o email existir, um link de recuperação será enviado.' };
  }

  async getProfile(userId: string): Promise<UserPublic | null> {
    const user = await userRepository.findById(userId);
    if (!user) return null;
    return toPublicUser(user);
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<UserPublic | null> {
    // Don't allow role changes through profile update
    const { role: _role, password: _password, ...safeData } = data;
    const updated = await userRepository.update(userId, safeData);
    if (!updated) return null;
    return toPublicUser(updated);
  }
}

export const authService = new AuthService();
