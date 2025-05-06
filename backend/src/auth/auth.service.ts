import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    if (!user.isEmailConfirmed) {
      throw new UnauthorizedException('Please confirm your email first');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async register(name: string, email: string, password: string) {
    const existingUser = await this.usersService.findOne(email);
    
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }
    
    const confirmationToken = uuidv4();
    
    const user = await this.usersService.create(
      name,
      email,
      password,
      confirmationToken,
    );
    
    await this.emailService.sendConfirmationEmail(email, confirmationToken);
    
    return {
      message: 'Registration successful! Please check your email to confirm your account.',
    };
  }

  async confirmEmail(token: string) {
    try {
      const user = await this.usersService.confirmEmail(token);
      return {
        message: 'Email confirmed successfully! You can now log in.',
      };
    } catch (error) {
      throw new BadRequestException('Invalid confirmation token');
    }
  }
}
