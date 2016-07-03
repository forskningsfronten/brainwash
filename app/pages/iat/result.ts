/// <reference path="../../../typings/modules/lodash/index.d.ts" />

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TestBlock, Stimuli } from '../iat/iat';
import * as _ from 'lodash';

@Component({
  templateUrl: 'build/pages/iat/result.html',
})
export class IatResultPage {

  public score: number;
  public outlierError: boolean = false;
  public tooManyErrors: boolean = false;
  public numericError: boolean = false;

  constructor(private nav: NavController, private navParam: NavParams) {
    let results = <TestBlock[]>navParam.data.result;

    // Algorithm from p.214:
    // Understanding and using the Implicit Association Test: I. An improved scoring algorithm.
    // Greenwald, A. G, Nosek, B. A., & Banaji, M. R. (2003).
    // Journal of Personality and Social Psychology, 85, 197-216.

    // Step 1 - Use data from b3, b4, b6, b7
    let b3 = results[2].stimuli;
    let b4 = results[3].stimuli;
    let b6 = results[5].stimuli;
    let b7 = results[6].stimuli;

    // Step 2 - Reject result because of extreme values for response times
    const minExtremeValue = 300;
    const maxExtremeValue = 10000;
    const extremeValueRejectionLimit = 0.1;
    let extremeValueRatios = _.map([b3, b4, b6, b7], s => this.extremeValueRatio(s, minExtremeValue, maxExtremeValue));
    if (_.some(extremeValueRatios, r => r > extremeValueRejectionLimit)) {
      this.outlierError = true;
      return;
    }

    // Reject result because of too may errors
    const errorRatioRejectionLimit = 0.2;
    let errorRatios = _.map([b3, b4, b6, b7], s => this.errorRatio(s, minExtremeValue, maxExtremeValue));
    if (_.some(errorRatios, r => r > errorRatioRejectionLimit)) {
      this.tooManyErrors = true;
      return;
    }

    // Step: 3 & 4 N/A

    // Step 5 - Mean of correct latencies
    let correctMeanB3 = _.mean(_.filter(b3, s => !s.error).map(s => s.time));
    let correctMeanB4 = _.mean(_.filter(b4, s => !s.error).map(s => s.time));
    let correctMeanB6 = _.mean(_.filter(b6, s => !s.error).map(s => s.time));
    let correctMeanB7 = _.mean(_.filter(b7, s => !s.error).map(s => s.time));

    console.log('correctMeanB3: ' + correctMeanB3);
    console.log('correctMeanB4: ' + correctMeanB4);
    console.log('correctMeanB6: ' + correctMeanB6);
    console.log('correctMeanB7: ' + correctMeanB7);


    // Step 6 - Pooled SD for all trials in b3 & b6, another for b4 & b7
    let timesB3B6 = _.map(b3, s => s.time).concat(_.map(b6, s => s.time))
    let meanB3B6 = _.mean(timesB3B6);
    let stdDevB3B6 = Math.sqrt(1 / (timesB3B6.length - 1) * _.sum(_.map(timesB3B6, t => Math.pow((t - meanB3B6), 2))));

    let timesB4B7 = _.map(b4, s => s.time).concat(_.map(b7, s => s.time))
    let meanB4B7 = _.mean(timesB4B7);
    let stdDevB4B7 = Math.sqrt(1 / (timesB4B7.length - 1) * _.sum(_.map(timesB4B7, t => Math.pow((t - meanB4B7), 2))));

    console.log('meanB3B6: ' + meanB3B6);
    console.log('meanB4B7: ' + meanB4B7);
    console.log('stdDevB3B6: ' + stdDevB3B6);
    console.log('stdDevB4B7: ' + stdDevB4B7);

    // Since we are to divide by the stddev it can't be too close to zero
    let stdDevLimit = 0.1;
    if (stdDevB3B6 < stdDevLimit || stdDevB4B7 < stdDevLimit) {
      this.numericError = true;
      return;
    }

    // Step 7 - Replace errors with block mean + penalty
    const errorPenalty = 600;
    _.filter(b3, s => s.error).forEach(s => s.time = correctMeanB3 + errorPenalty);
    _.filter(b4, s => s.error).forEach(s => s.time = correctMeanB4 + errorPenalty);
    _.filter(b6, s => s.error).forEach(s => s.time = correctMeanB6 + errorPenalty);
    _.filter(b7, s => s.error).forEach(s => s.time = correctMeanB7 + errorPenalty);

    // Step 8 - N/A

    // Step 9 - Average of each block
    let meanB3 = _.mean(_.map(b3, s => s.time));
    let meanB4 = _.mean(_.map(b4, s => s.time));
    let meanB6 = _.mean(_.map(b6, s => s.time));
    let meanB7 = _.mean(_.map(b7, s => s.time));

    // Step 10: Compute B6 - B3 & B7 - B4
    // Step 11: Normalize with SD
    let scoreB3B6 = (meanB6 - meanB3) / stdDevB3B6;
    let scoreB4B7 = (meanB7 - meanB4) / stdDevB4B7;

    console.log('scoreB3B6: ' + scoreB3B6);
    console.log('scoreB4B7: ' + scoreB4B7);

    // Step 12:
    this.score = (scoreB3B6 + scoreB4B7) / 2.0;
    console.log('score: ' + this.score);

  }

  extremeValueRatio(stimuli: Stimuli[], min: number, max: number) {
    return (_.countBy(stimuli, s => (s.time < min || s.time > max) ? 'outlier' : 'valid')['outlier'] || 0) / stimuli.length;
  }

  errorRatio(stimuli: Stimuli[], min: number, max: number) {
    return (_.countBy(stimuli, s => s.error ? 'error' : 'ok')['error'] || 0) / stimuli.length;
  }
}
