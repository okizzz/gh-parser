import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { TransformFactory } from '../transform.factory';

@Injectable()
export class BaseTransformService implements OnModuleInit {
  protected action = '';

  constructor(protected readonly transformFactory: TransformFactory) {}

  onModuleInit(): any {
    this.transformFactory.register(this.action, this);
  }
}
