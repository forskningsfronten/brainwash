/// <reference path="../../../typings/modules/lodash/index.d.ts" />

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TrainingExample, ITrainingExampleResult } from '../training/training';
import * as _ from 'lodash';

@Component({
  templateUrl: 'build/pages/training/result.html',
})
export class TrainingResultPage {
  //results: ITrainingExampleResult[];
  numSamples: number;
  avgTap: number;
  numErrors: number;

  constructor(private nav: NavController, private navParam: NavParams) {
    let results = <ITrainingExampleResult[]>navParam.data.result;

    this.numSamples = results.length;
    let noTaps = _.filter(results, r => r.tapTime == null);
    let taps = _.filter(results, r => r.tapTime != null);

    if (taps.length > 0)
      this.avgTap = _.sum(_.map(taps, r => r.tapTime)) / taps.length;
    else
      this.avgTap = 0;

    let x = _.countBy(results, r => (r.tapTime !== null && r.example.counterStereotype) || (r.tapTime === null && !r.example.counterStereotype) ? 'correct' : 'wrong');
    this.numErrors = x['wrong'];

  }
}
