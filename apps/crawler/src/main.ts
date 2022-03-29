import { NestFactory } from '@nestjs/core';
import { CrawlerModule } from './crawler.module';
import * as path from 'path';
import { ConfigService } from 'nestjs-config';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const configPath = path.resolve(__dirname, 'config/**/!(*.d).{ts,js}');
  const config = ConfigService.loadSync(configPath);
  const { debug } = config.get('app');
  const { url, queueName, queueType, persistent, durable, prefetchCount } =
    config.get('amqp');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CrawlerModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [url],
        noAck: false,
        persistent,
        queue: queueName,
        queueOptions: {
          durable,
          arguments: { 'x-queue-type': queueType },
        },
        prefetchCount,
      },
    },
  );

  app.enableShutdownHooks();
  await app.listen();
}
bootstrap();
