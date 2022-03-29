import { Injectable } from '@nestjs/common';
import { ConfigService } from 'nestjs-config';
import { HttpsProxyAgent } from 'https-proxy-agent';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class ProxyService {
  private readonly rotateUrl: string;
  private axios: AxiosInstance;
  private rotatePromise: Promise<boolean>;

  constructor(config: ConfigService) {
    const { host, port, auth, rotateUrl } = config.get('proxy');
    console.log({ host, port, auth, rotateUrl });
    const httpsAgent = new HttpsProxyAgent({
      host,
      port,
      auth,
      timeout: 5000,
    });
    this.axios = axios.create({
      validateStatus: function (status) {
        return status < 500;
      },
    });
    this.rotateUrl = rotateUrl;
  }

  async request(url) {
    return this.axios.get(url);
  }

  async rotate() {
    if (!this.rotatePromise) {
      this.rotatePromise = new Promise((resolve, reject) => {
        axios.get(this.rotateUrl).then((data) => {
          console.log(data);
          resolve(true);
        });
      });
    }

    return this.rotatePromise;
  }
}
