import { ClientOptions, Transport } from '@nestjs/microservices';

export const createConfig = (groupId: string): ClientOptions => {
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
