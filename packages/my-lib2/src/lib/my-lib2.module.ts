import { NgModule } from '@angular/core';
import { MyLib2Component } from './my-lib2.component';
import { Component2Component } from './component2/component2.component';

@NgModule({
  declarations: [MyLib2Component, Component2Component],
  imports: [
  ],
  exports: [MyLib2Component]
})
export class MyLib2Module { }
