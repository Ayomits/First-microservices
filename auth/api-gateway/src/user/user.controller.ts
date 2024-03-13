import { Body, Controller, OnModuleInit, Post } from '@nestjs/common';
import { Client, ClientKafka } from '@nestjs/microservices';
import { createConfig } from 'src/constants';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController implements OnModuleInit {

  onModuleInit() {
    const requestTopics = [
      'user.create'
    ]

    for (const topic of requestTopics) {
      this.client.subscribeToResponseOf(topic)
    }
  }

  @Client(createConfig(`user-service`))
  client: ClientKafka

  @Post(`create`)
  create(@Body() createUserDto: CreateUserDto) {
    return this.client.send(`user.create`, createUserDto)
  }
}
