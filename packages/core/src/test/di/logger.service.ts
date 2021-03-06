import { Injectable } from 'injection-js';

@Injectable()
export class Logger {
  public logs: string[] = []; // capture logs for testing

  public log(message: string) {
    this.logs.push(message);
    // tslint:disable-next-line:no-console
    console.log(message);
  }
}


/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/