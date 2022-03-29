import * as env from 'env-var';

export default {
  url: env.get('MONGO_URL').default('mongodb://localhost/gh-parser').asString(),
};
