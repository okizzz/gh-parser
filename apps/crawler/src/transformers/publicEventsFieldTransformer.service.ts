import { TransformerInterface } from './transformer.interface';
import { BaseTransformService } from './baseTransform.service';
import { Injectable } from '@nestjs/common';
import { TransformFactory } from '../transform.factory';

@Injectable()
export class PublicEventsFieldTransformerService
  extends BaseTransformService
  implements TransformerInterface
{
  constructor(readonly transformFactory: TransformFactory) {
    super(transformFactory);
    this.action = 'events/public';
  }

  handle(data) {
    return { 'events.public': data };
  }
}
