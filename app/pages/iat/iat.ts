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
  testBlock: TestBlock;


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

    let stimuli = _.shuffle(this.getSamples(5, woman, 'Kvinna')
    .concat(this.getSamples(5, man, 'Man')));

    this.testBlock = {
      leftCategories: { first: 'Kvinna', second: 'Vetenskap' },
      rightCategories: { first: 'Man', second: 'Humanism' },
      stimuli: stimuli
    };
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
    // if (this.navBackAlert_.leavingPage)
    //   return;

    if (this.currentIndex == this.testBlock.stimuli.length - 1) {
      // No more examples, training finished
      this.navBackAlert_ = null;
      this.nav.pop();
      return;
    }

    this.time = Date.now();
    this.currentIndex += 1;
    this.currentStimuli = this.testBlock.stimuli[this.currentIndex];
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
    && (this.currentStimuli.category === this.testBlock.leftCategories.first
      || this.currentStimuli.category === this.testBlock.leftCategories.second))
      || (pressCategory === 'RIGHT'
      && (this.currentStimuli.category === this.testBlock.rightCategories.first
        || this.currentStimuli.category === this.testBlock.rightCategories.second))) {

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
