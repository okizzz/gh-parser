import { TransformerInterface } from './transformer.interface';
import { BaseTransformService } from './baseTransform.service';
import { TransformFactory } from '../transform.factory';

export class AllEventsFieldTransformerService
  extends BaseTransformService
  implements TransformerInterface
{
  constructor(readonly transformFactory: TransformFactory) {
    super(transformFactory);
    this.action = 'events';
  }

  handle(data) {
    return { 'events.events': data };
  }
}
