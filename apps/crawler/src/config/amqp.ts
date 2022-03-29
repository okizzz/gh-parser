import * as env from 'env-var';

export default {
  url: env
    .get('AMQP_URL')
    .default('amqp://user:bitnami@localhost:5672/')
    .asUrlString(),
  persistent: env.get('AMQP_PERSISTENT_MESSAGES').default('true').asBool(),
  durable: env.get('AMQP_DURABLE_QUEUE').default('true').asBool(),
  prefetchCount: env.get('AMQP_PREFETCH_COUNT').default('1').asIntPositive(),
  queueType: env
    .get('QUEUE_TYPE')
    .default('classic')
    .asEnum(['classic', 'quorum']),
  queueName: env.get('CRAWLER_QUEUE').default('crawler').asString(),
};
