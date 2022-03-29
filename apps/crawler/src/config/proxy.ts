import * as env from 'env-var';

export default {
  host: env.get('PROXY_HOST').default('gproxy.site').asString(),
  port: env.get('PROXY_PORT').default('11345').asPortNumber(),
  auth: env.get('PROXY_AUTH').default('YG9AFN:Yg1nEW7AdyTE').asString(),
  rotateUrl: env
    .get('PROXY_ROTATE_URL')
    .default(
      'https://mobileproxy.space/reload.html?proxy_key=ea701c53d6093bdac2792ccc51ffa58f',
    )
    .asString(),
};
