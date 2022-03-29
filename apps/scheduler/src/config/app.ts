import * as env from 'env-var';

export default {
  queueName: env.get('QUEUE_NAME').default('gh-account-queue').asString(),
  debug: env.get('DEBUG').default('false').asBool(),
  port: env.get('PORT').default('3000').asPortNumber(),
};
