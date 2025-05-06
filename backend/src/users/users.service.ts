import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(name: string, email: string, password: string, confirmationToken: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
      confirmationToken,
      isEmailConfirmed: false,
    });
    
    return this.usersRepository.save(newUser);
  }

  async confirmEmail(token: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { confirmationToken: token } });
    
    if (!user) {
      throw new Error('User not found or invalid token');
    }
    
    user.isEmailConfirmed = true;
    user.confirmationToken = null;
    
    return this.usersRepository.save(user);
  }
}
