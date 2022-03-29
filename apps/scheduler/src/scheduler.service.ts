import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ClientService } from './constants';
import { CrawlPayload } from '@gh-parser/common';

const actions = [
  '',
  'received_events',
  'events',
  'events/public',
  'repos',
  'subscriptions',
];

@Injectable()
export class SchedulerService {
  constructor(
    @Inject(ClientService.scheduler) private schedulerClient: ClientProxy,
    @Inject(ClientService.crawler) private crawlerClient: ClientProxy,
  ) {}

  async schedule(username: string): Promise<void> {
    try {
      await this.schedulerClient.emit('schedule', { username });
    } catch (e) {
      console.error(`schedule failed for username ${username}`);
      throw new Error('SCHEDULE_FAILED');
    }
  }

  async createTasks(username: string): Promise<any[]> {
    return Promise.all(
      actions.map((action) => {
        return this.crawlerClient
          .emit('crawl', { username, action } as CrawlPayload)
          .toPromise();
      }),
    );
  }
}
