import { Controller } from '@nestjs/common';
import { Client, ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { createConfig } from 'src/constants';

@Controller()
export class UserController {

  @Client(createConfig(`user-service`))
  client: ClientKafka

  constructor(
    private readonly userService: UserService
    ) {}

  @MessagePattern('user.create')
  create(@Payload() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
    
  }

  // Paganition users soon
  @MessagePattern(`user.findByPage`)
  findByPage(){}

  @MessagePattern('user.findById')
  findOne(@Payload() id: number) {
    return {
      "user": this.userService.findById(id)
    }
  }

  @MessagePattern(`user.findByName`) 
  findByName(@Payload() name: string) {
    return {
      "user": this.userService.findByUsername(name)
    }
  }

  @MessagePattern('user.update')
  update(@Payload() updateUserDto: UpdateUserDto) {
    return {
      "newUser": this.userService.update(updateUserDto.id, updateUserDto),
      "oldUser": this.userService.findById(updateUserDto.id)
    }
  }

  @MessagePattern('user.remove')
  remove(@Payload() id: number) {
    return this.userService.remove(id);
  }
}
