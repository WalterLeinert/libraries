import { Metadata } from '../../base/metadata';

export class PropertyMetadata extends Metadata<Object> {

  constructor(target: Object, name: string) {
    super(target, name);
  }
}