import { Controller, Get, Inject, OnModuleInit, Post } from '@nestjs/common';
import { Client, ClientKafka, ClientProxy } from '@nestjs/microservices';
import { createConfig } from 'src/constants';

const config = createConfig(`auth`)

@Controller('auth')
export class AuthController implements OnModuleInit {
  @Client(config)
  client: ClientKafka

  onModuleInit() {
    this.client.subscribeToResponseOf(`auth.hello`)
    this.client.subscribeToResponseOf(`auth.bye`)
  }

  @Post(`/login`)
  login() {}

  @Post(`/register`)
  register() {}
}
