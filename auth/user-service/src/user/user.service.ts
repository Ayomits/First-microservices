import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Cache } from '@nestjs/cache-manager';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private cacheManager: Cache
  ) {}

  async create(createUserDto: CreateUserDto) {
    const errorInCache = await this.cacheManager.get(`already-exist-${createUserDto.username}`)
    if (errorInCache) {
      return {
        message: "This user already exist",
        status: 400
      }
    }
    const existedUser = await this.findByUsername(createUserDto.username);
    if (!existedUser) {
      await this.cacheManager.set(`already-exist-${createUserDto.username}`, createUserDto.username, 3_000_000)
      return {
        message: "This user already exist",
        status: 400
      }
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 5)
    const newUser = await this.userRepository.save(
      this.userRepository.create({...createUserDto, password: hashedPassword}),
    );
    Promise.all([
      await this.cacheManager.set(`user-${newUser.username}`, newUser, 3_000_000),
      await this.cacheManager.set(`user-${newUser.id}`, newUser, 3_000_000)
    ])
    return newUser
  }

  async findById(id: number): Promise<UserEntity | null> {
    const userInCache = await this.cacheManager.get(`user-${id}`)

    if (userInCache) {
      return userInCache as UserEntity
    }

    return await this.userRepository.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { username: username } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity | null> {
    const existedUser = await this.findById(id)
    if (!existedUser) {
      return null
    }
    await this.userRepository.update(id, updateUserDto)
    return await this.findById(id)
    
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
