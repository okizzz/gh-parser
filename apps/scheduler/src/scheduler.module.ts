import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SchedulerController } from './scheduler.controller';
import { SchedulerService } from './scheduler.service';
import { ClientService } from './constants';
import * as path from 'path';
import { ConfigService } from 'nestjs-config';

const configPath = path.resolve(__dirname, 'config/**/!(*.d).{ts,js}');
const config = ConfigService.loadSync(configPath);
const { url, schedulerQueueName, crawlerQueueName, persistent, queueType } =
  config.get('amqp');

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ClientService.scheduler,
        transport: Transport.RMQ,
        options: {
          urls: [url],
          queue: schedulerQueueName,
          persistent,
          queueOptions: {
            durable: true,
            arguments: { 'x-queue-type': queueType },
          },
        },
      },
      {
        name: ClientService.crawler,
        transport: Transport.RMQ,
        options: {
          urls: [url],
          queue: crawlerQueueName,
          persistent,
          queueOptions: {
            durable: true,
            arguments: { 'x-queue-type': queueType },
          },
        },
      },
    ]),
  ],
  controllers: [SchedulerController],
  providers: [SchedulerService],
})
export class SchedulerModule {}
