import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ProxyService } from './proxy.service';
import { TransformFactory } from './transform.factory';
import { ProfileService } from './profile.service';

interface CrawlParams {
  username: string;
  action: string;
}
const baseUrl = 'https://api.github.com/users';

@Injectable()
export class CrawlerService {
  constructor(
    private readonly proxyService: ProxyService,
    private readonly elasticsearchService: ElasticsearchService,
    private readonly transformFactory: TransformFactory,
    private readonly profileService: ProfileService,
  ) {}

  async crawl({ username, action }: CrawlParams): Promise<void> {
    const url = `${baseUrl}/${username}${action ? '/' : ''}${action}`;

    try {
      const { data, status, statusText } = await this.proxyService.request(url);

      if (status === 403) {
        await this.proxyService.rotate();
      }

      if (status !== 200) {
        throw new Error(statusText);
      }

      const updateObject = this.transformFactory.resolve(action).handle(data);
      const enrichedProfile = await this.save(updateObject);
      if (enrichedProfile) {
        await this.index(enrichedProfile);
      }
    } catch (e) {
      console.error(`failed to crawl ${url} because of ${e.message}`);
      throw new Error('PROXY_FAILED');
    }
  }

  async index(document) {
    await this.elasticsearchService.index({
      index: 'github-profiles',
      document,
    });
  }

  async save(data) {
    await this.profileService.upsert(data);
    return this.profileService.getEnrichedOne(data.username);
  }
}
