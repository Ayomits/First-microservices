import { ClientOptions, KafkaOptions, Transport } from "@nestjs/microservices";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const createConfig = (groupId: string): ClientOptions | KafkaOptions => {
  return {
    transport: Transport.KAFKA,

    options: {
      client: {
        brokers: ['0.0.0.0:9092'],
      },
      consumer: {
        groupId: groupId,
        allowAutoTopicCreation: true,
      },
    },
  };
};

export const typeormSettings: TypeOrmModuleOptions = {
  type: 'postgres',
  host: '0.0.0.0',
  port: 5432,
  username: 'postgres',
  password: '1234',
  database: 'localdb',
  synchronize: true,
  entities: [
    __dirname + `**/**/*.{ts,js}`
  ]
}
