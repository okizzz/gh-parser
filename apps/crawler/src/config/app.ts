import * as env from 'env-var';

export default {
  debug: env.get('DEBUG').default('false').asBool(),
};
