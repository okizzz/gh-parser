import { Module } from '@nestjs/common';
import { CrawlerController } from './crawler.controller';
import { CrawlerService } from './crawler.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ProxyService } from './proxy.service';
import { ConfigService, ConfigModule } from 'nestjs-config';
import { MongooseModule } from '@nestjs/mongoose';
import * as path from 'path';
import { AllEventsFieldTransformerService } from './transformers/allEventsFieldTransformer.service';
import { PublicEventsFieldTransformerService } from './transformers/publicEventsFieldTransformer.service';
import { ReceivedEventsFieldTransformerService } from './transformers/receivedEventsFieldTransformer.service';
import { ReposFieldTransformerService } from './transformers/reposFieldTransformer.service';
import { SubscriptionsFieldTransformerService } from './transformers/subscriptionsFieldTransformer.service';
import { UserFieldTransformerService } from './transformers/userFieldTransformer.service';
import { TransformFactory } from './transform.factory';
import { GithubProfileSchema, Profile } from './schemas/profile.schema';
import { ProfileService } from './profile.service';

const configPath = path.resolve(__dirname, 'config/**/!(*.d).{ts,js}');
const config = ConfigService.loadSync(configPath);

@Module({
  imports: [
    ElasticsearchModule.register({
      node: config.get('elastic').node,
    }),
    MongooseModule.forRoot(config.get('mongo').url),
    MongooseModule.forFeature([
      { name: Profile.name, schema: GithubProfileSchema },
    ]),
    ConfigModule.load(configPath),
  ],
  controllers: [CrawlerController],
  providers: [
    ProfileService,
    CrawlerService,
    ProxyService,
    TransformFactory,
    AllEventsFieldTransformerService,
    PublicEventsFieldTransformerService,
    ReceivedEventsFieldTransformerService,
    ReposFieldTransformerService,
    SubscriptionsFieldTransformerService,
    UserFieldTransformerService,
  ],
})
export class CrawlerModule {}
