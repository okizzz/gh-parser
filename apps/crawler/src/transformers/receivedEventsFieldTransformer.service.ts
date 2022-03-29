import { TransformerInterface } from './transformer.interface';
import { BaseTransformService } from './baseTransform.service';
import { Injectable } from '@nestjs/common';
import { TransformFactory } from '../transform.factory';

@Injectable()
export class ReceivedEventsFieldTransformerService
  extends BaseTransformService
  implements TransformerInterface
{
  constructor(readonly transformFactory: TransformFactory) {
    super(transformFactory);
    this.action = 'received_events';
  }

  handle(data) {
    return { 'events.received': data };
  }
}
