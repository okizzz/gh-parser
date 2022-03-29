import * as env from 'env-var';

export default {
  node: env
    .get('ELASTICSEARCH_NODE')
    .default('http://localhost:9200')
    .asString(),
};
