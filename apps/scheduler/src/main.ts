import { NestFactory } from '@nestjs/core';
import { SchedulerModule } from './scheduler.module';
import * as path from 'path';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { ConfigService } from 'nestjs-config';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const configPath = path.resolve(__dirname, 'config/**/!(*.d).{ts,js}');
  const config = ConfigService.loadSync(configPath);
  const { port, debug } = config.get('app');
  const {
    url,
    schedulerQueueName,
    queueType,
    persistent,
    durable,
    prefetchCount,
  } = config.get('amqp');

  const app = await NestFactory.create<NestFastifyApplication>(
    SchedulerModule,
    new FastifyAdapter({ logger: debug }),
  );
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [url],
      noAck: false,
      persistent,
      queue: schedulerQueueName,
      queueOptions: {
        durable,
        arguments: { 'x-queue-type': queueType },
      },
      prefetchCount,
    },
  });

  app.enableShutdownHooks();
  await app.listen(port);
  await app.startAllMicroservices();
}
bootstrap();
