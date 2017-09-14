import { Assert } from '@fluxgate/core';

import { E2eComponent, IE2eComponent } from './e2e-component';


/**
 * helper class for container components (e.g. tab)
 *
 * @export
 */
export class ContainerComponent extends E2eComponent {

  private _children: IE2eComponent[];

  constructor(parent: IE2eComponent, css: string) {
    super(parent, css);

    this._children = [];
  }


  public addComponent(component: IE2eComponent) {
    this._children.push(component);
  }

  public getComponent<T extends IE2eComponent>(index: number): T {
    Assert.that(index >= 0 && index < this._children.length);
    return this._children[index] as T;
  }

}