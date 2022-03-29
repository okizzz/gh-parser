import { TransformerInterface } from './transformer.interface';
import { BaseTransformService } from './baseTransform.service';
import { Injectable } from '@nestjs/common';
import { TransformFactory } from '../transform.factory';

@Injectable()
export class ReposFieldTransformerService
  extends BaseTransformService
  implements TransformerInterface
{
  constructor(readonly transformFactory: TransformFactory) {
    super(transformFactory);
    this.action = 'repos';
  }

  handle(data) {
    return { repos: data };
  }
}
