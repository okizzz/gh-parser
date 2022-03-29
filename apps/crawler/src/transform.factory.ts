import { TransformerInterface } from './transformers/transformer.interface';

export class TransformFactory {
  private readonly actions: Record<string, TransformerInterface> = {};

  register(action, service) {
    this.actions[action] = service;
  }

  resolve(action) {
    return this.actions[action];
  }
}
