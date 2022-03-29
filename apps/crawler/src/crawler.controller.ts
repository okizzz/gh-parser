import { Controller } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { CrawlerService } from './crawler.service';
import { CrawlPayload } from '@gh-parser/common';

@Controller()
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @EventPattern('crawl')
  async crawl(@Payload() data: CrawlPayload, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.crawlerService.crawl(data);
      channel.ack(originalMsg);
    } catch (e) {
      console.error(e);
    }
  }
}
