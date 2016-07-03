import { beforeEach, it, describe, expect, inject } from '@angular/core/testing';
import { IatResultPage } from './result';
import * as _ from 'lodash';


class MockNav {
  public ready(): any {
    return new Promise((resolve: Function) => {
      resolve();
    });
  }

  public close(): any {
    return true;
  }

  public setRoot(): any {
    return true;
  }
}

function makeStimuli(ms: number, error: boolean = false) {
  return {time: ms, error: error};
}

function makeTestBlock(times: number[]) {
  return {stimuli: _.map(times, t => makeStimuli(t)) };
}

let resultPage: IatResultPage = null;
let testBlock = null;
let mockNav: any = (<any>new MockNav());

describe('IatResultPage', () => {
  beforeEach(() => {

    testBlock = new Array();
    testBlock[2] = makeTestBlock(_.map(new Array<number>(20), (_, i) => i + 600));
    testBlock[3] = makeTestBlock(_.map(new Array<number>(40), (_, i) => i + 800));
    testBlock[5] = makeTestBlock(_.map(new Array<number>(20), (_, i) => i + 1000));
    testBlock[6] = makeTestBlock(_.map(new Array<number>(40), (_, i) => i + 1200));
    // Test data should give score: 1.979
  });

  it('computes a correct score', () => {
    resultPage = new IatResultPage(mockNav, (<any>{data: {result: testBlock}}));
    expect(resultPage.score).toBeCloseTo(1.979, 2);
  });

  it('detects outlier errors', () => {
    resultPage = new IatResultPage(mockNav, (<any>{data: {result: testBlock}}));
    expect(resultPage.outlierError).toBeFalsy();

    testBlock[2].stimuli[0].time = 100; // One outlier < 10%, no error
    resultPage = new IatResultPage(mockNav, (<any>{data: {result: testBlock}}));
    expect(resultPage.outlierError).toBeFalsy();

    testBlock[2].stimuli[1].time = 100; // Outliers  > 10%, no error
    testBlock[2].stimuli[2].time = 100;
    resultPage = new IatResultPage(mockNav, (<any>{data: {result: testBlock}}));
    expect(resultPage.outlierError).toBeTruthy();

    _.forEach(testBlock[2].stimuli, s => s.time = 100); // All are outliers
    resultPage = new IatResultPage(mockNav, (<any>{data: {result: testBlock}}));
    expect(resultPage.outlierError).toBeTruthy();
  });

  it('detects too many errors', () => {
    resultPage = new IatResultPage(mockNav, (<any>{data: {result: testBlock}}));
    expect(resultPage.tooManyErrors).toBeFalsy();

    testBlock[2].stimuli[0].error = true;
    resultPage = new IatResultPage(mockNav, (<any>{data: {result: testBlock}}));
    expect(resultPage.tooManyErrors).toBeFalsy();

    testBlock[2].stimuli[1].error = true;
    testBlock[2].stimuli[2].error = true;
    testBlock[2].stimuli[3].error = true;
    testBlock[2].stimuli[4].error = true;
    testBlock[2].stimuli[5].error = true;
    resultPage = new IatResultPage(mockNav, (<any>{data: {result: testBlock}}));
    expect(resultPage.tooManyErrors).toBeTruthy();

    _.forEach(testBlock[2].stimuli, s => s.error = true);
    resultPage = new IatResultPage(mockNav, (<any>{data: {result: testBlock}}));
    expect(resultPage.tooManyErrors).toBeTruthy();
  });

  it('detects numeric problem with low stddev', () => {
    _.forEach(testBlock[2].stimuli, s => s.time = 500); // Zero stddev
    _.forEach(testBlock[5].stimuli, s => s.time = 500); // Zero stddev
    resultPage = new IatResultPage(mockNav, (<any>{data: {result: testBlock}}));
    expect(resultPage.numericError).toBeTruthy();
  });
});
