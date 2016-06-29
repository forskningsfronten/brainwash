/// <reference path="../../../typings/modules/lodash/index.d.ts" />

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TestBlock } from '../iat/iat';
import * as _ from 'lodash';

@Component({
  templateUrl: 'build/pages/iat/result.html',
})
export class IatResultPage {

  constructor(private nav: NavController, private navParam: NavParams) {
    let results = <TestBlock[]>navParam.data.result;
  }
}
