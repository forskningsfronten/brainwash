/// <reference path="../../../typings/modules/lodash/index.d.ts" />

import {Component} from '@angular/core';
import {NavController, NavParams, Animation, Alert} from 'ionic-angular';
import {StartPage} from '../start-page/start-page';
import {NavBackAlert} from '../core/ionic-nav-ext';
import * as _ from 'lodash';

interface TestBlock {
  leftCategories: { first: string, second: string };
  rightCategories: { first: string, second: string };
  stimuli: Stimuli[];
}

interface Stimuli {
  category: string;
  word: string;
}

@Component({
  templateUrl: 'build/pages/iat/iat.html'
})
export class IatPage {
  stimuli: string;

  leftPage: boolean;

  time: number;
  currentIndex: number;

  currentStimuli: Stimuli;
  testBlocks: TestBlock[];
  currentBlock = -1;

  private getSamples(n:number, values:string[], category: string) {
    return Array(n).fill(0).map((_, idx) => ({
        word: values[idx % values.length],
        category: category
      }));
  }

  private createTestData() {
    let woman = ['Kvinna', 'Tjej', 'Moster', 'Dotter', 'Fru', 'Dam', 'Moder', 'Mormor'];
    let man = ['Man', 'Kille', 'Far', 'Herre', 'Farfar', 'Fästman', 'Son', 'Farbror'];
    let humanism = ['Filosofi', 'Estetik', 'Konstvetenskap', 'Litteraturvetenskap', 'Språkvetenskap', 'Musikvetenskap', 'Historia'];
    let science = ['Biologi', 'Fysik', 'Kemi', 'Matematik', 'Geologi', 'Astronomi', 'Ingenjörsvetenskap'];

    let stimuli = _.shuffle(this.getSamples(5, woman, 'Kvinna').concat(this.getSamples(5, man, 'Man')));

    let block1 = {
      leftCategories: { first: 'Kvinna', second: null },
      rightCategories: { first: 'Man', second: null },
      stimuli: _.shuffle(
        this.getSamples(2, woman, 'Kvinna').concat(
        this.getSamples(2, man, 'Man')))
    };
    let block2 = {
      leftCategories: { first: 'Vetenskap', second: null },
      rightCategories: { first: 'Humanism', second: null },
      stimuli: _.shuffle(
        this.getSamples(2, science, 'Vetenskap').concat(
        this.getSamples(2, humanism, 'Humanism')))
    };
    let block3 = {
      leftCategories: { first: 'Kvinna', second: 'Vetenskap' },
      rightCategories: { first: 'Man', second: 'Humanism' },
      stimuli: _.shuffle(
        this.getSamples(2, woman, 'Kvinna').concat(
        this.getSamples(2, man, 'Man')).concat(
        this.getSamples(2, science, 'Vetenskap')).concat(
        this.getSamples(2, humanism, 'Humanism')))
    };

    this.currentBlock = 0;
    this.testBlocks = [block1, block2, block3];
  }

  constructor(private nav: NavController, navParams: NavParams) {
    console.log("CTOR");

    this.navBackAlert_ = new NavBackAlert(nav, 'Training Canceled', 'Now exiting');

    this.createTestData();
    this.currentIndex = -1;
    this.nextExample();
  }

  nextExample() {
    console.log("nextExample()");
    this.showError = false;

    console.log('A');

    if (this.currentBlock === (this.testBlocks.length - 1)
      && (this.currentIndex === (this.testBlocks[this.currentBlock].stimuli.length - 1))) {
      // No more examples, iat finished
      this.navBackAlert_ = null;
      this.nav.pop();
      return;
    }
    console.log('B');

    if (this.currentIndex === (this.testBlocks[this.currentBlock].stimuli.length - 1)) {
      // End of block, transition to next block
      this.currentBlock += 1;
      this.currentIndex = -1;
    }
    console.log('C CB ' + this.currentBlock );

    this.time = Date.now();
    this.currentIndex += 1;
    this.currentStimuli = this.testBlocks[this.currentBlock].stimuli[this.currentIndex];
  }

  showError: boolean = false;

  leftPress() {
    this.press('LEFT');
  }

  rightPress() {
    this.press('RIGHT');
  }

  private press(pressCategory: string) {
    console.log('Press ' + pressCategory);

    console.log('this.currentStimuli.category: ' + this.currentStimuli.category);

    if ((pressCategory === 'LEFT'
    && (this.currentStimuli.category === this.testBlocks[this.currentBlock].leftCategories.first
      || this.currentStimuli.category === this.testBlocks[this.currentBlock].leftCategories.second))
      || (pressCategory === 'RIGHT'
      && (this.currentStimuli.category === this.testBlocks[this.currentBlock].rightCategories.first
        || this.currentStimuli.category === this.testBlocks[this.currentBlock].rightCategories.second))) {

    // Correct response - tap on counter stereotype - show positive response

    let delay = Date.now() - this.time;
    console.log('Correct response after: ' + delay + ' ms');

    // this.result.push({
    //   example: this.current,
    //   tapTime: delay
    // });

    this.nextExample();
    }
    else {
      // Wrong response
      console.log('Wrong response');
      this.showError = true;
    }
  }

  private navBackAlert_: NavBackAlert;
  ionViewWillLeave() {
    if (this.navBackAlert_)
      this.navBackAlert_.showAlert();
  }
}
