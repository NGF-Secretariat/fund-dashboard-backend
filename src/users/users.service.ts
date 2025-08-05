import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { PasswordService } from '../common/services/password.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private passwordService: PasswordService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      // Check if user with email already exists
      const existingUser = await this.usersRepository.findOneBy({ email: createUserDto.email });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      // Hash the password before saving
      const hashedPassword = await this.passwordService.hashPassword(createUserDto.password);
      
      const user = this.usersRepository.create({
        name: createUserDto.name,
        email: createUserDto.email,
        role: createUserDto.role,
        passwordHash: hashedPassword,
      });
      const savedUser = await this.usersRepository.save(user);
      
      // Return user without password
      const { passwordHash, ...userInfo } = savedUser;
      return { success: true, data: userInfo };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Failed to create user');
    }
  }

  async findAll() {
    try {
      const users = await this.usersRepository.find();
      // Remove passwordHash from all users
      const usersWithoutPassword = users.map(user => {
        const { passwordHash, ...userInfo } = user;
        return userInfo;
      });
      return { success: true, data: usersWithoutPassword };
    } catch (error) {
      throw new Error('Failed to fetch users');
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      
      // Remove passwordHash from user
      const { passwordHash, ...userInfo } = user;
      return { success: true, data: userInfo };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to fetch user');
    }
  }

  async update(id: number, updateUserDto: Partial<User>) {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      await this.usersRepository.update(id, updateUserDto);
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to update user');
    }
  }

  async remove(id: number) {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      
      await this.usersRepository.remove(user);
      const { passwordHash, ...userInfo } = user;
      return { success: true, data: userInfo };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to delete user');
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.usersRepository.findOneBy({ email: loginDto.email });
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      
      // Compare password with hashed password
      const isPasswordValid = await this.passwordService.comparePassword(
        loginDto.password,
        user.passwordHash
      );
      
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
      
      // Return user info (omit passwordHash)
      const { passwordHash, ...userInfo } = user;
      return { success: true, data: userInfo };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new Error('Login failed');
    }
  }
}
