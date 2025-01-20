import { ProcessingLayer } from '../layers/processing-layers';

export class StateObserver {
  public observe(layer: ProcessingLayer, state: unknown): void {
    console.log(`[${layer}] Processing state:`, state);
  }
}
