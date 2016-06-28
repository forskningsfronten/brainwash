/// <reference path="../../../typings/modules/lodash/index.d.ts" />

import {Component} from '@angular/core';
import {NavController, NavParams, Animation, Alert} from 'ionic-angular';
import {StartPage} from '../start-page/start-page';
import {NavBackAlert} from '../core/ionic-nav-ext';
import * as _ from 'lodash';

interface TestBlock {
  leftConcepts: { first: string, second: string };
  rightConcepts: { first: string, second: string };
  stimuli: Stimuli[];
}

interface Concept {
  title: string,
  words: string[]
}

// 1A and 1B are semanitcally orthogonal, i.e. man & woman
// 2A and 2B are semanitcally orthogonal, i.e. science & humanism
interface ConceptSet {
  concept1A: Concept,
  concept1B: Concept,
  concept2A: Concept,
  concept2B: Concept
}

interface Stimuli {
  ofConcept: string;
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

  private getSamples(n:number, values:string[], concept: string) {
    return Array(n).fill(0).map((_, idx) => ({
        word: values[idx % values.length],
        ofConcept: concept
      }));
  }

  private getConceptSet() {
    return {
      concept1A: {
        title: 'Kvinna',
        words: ['Kvinna', 'Tjej', 'Moster', 'Dotter', 'Fru', 'Dam', 'Moder', 'Mormor']
      },
      concept1B: {
        title: 'Man',
        words: ['Man', 'Kille', 'Far', 'Herre', 'Farfar', 'Fästman', 'Son', 'Farbror']
      },
      concept2A: {
        title: 'Humanism',
        words: ['Filosofi', 'Estetik', 'Konstvetenskap', 'Litteraturvetenskap', 'Språkvetenskap', 'Musikvetenskap', 'Historia']
      },
      concept2B: {
        title: 'Vetenskap',
        words: ['Biologi', 'Fysik', 'Kemi', 'Matematik', 'Geologi', 'Astronomi', 'Ingenjörsvetenskap']
      }
    }
  }

  private createTestData() {
    let concepts = this.getConceptSet();

    // n = 20 : Practice
    let block1 = {
      leftConcepts: { first: concepts.concept1A.title, second: null },
      rightConcepts: { first: concepts.concept1B.title, second: null },
      stimuli: _.shuffle(
        this.getSamples(2, concepts.concept1A.words, concepts.concept1A.title).concat(
        this.getSamples(2, concepts.concept1B.words, concepts.concept1B.title)))
    };
    // n = 20 : Practice
    let block2 = {
      leftConcepts: { first: concepts.concept2A.title, second: null },
      rightConcepts: { first: concepts.concept2B.title, second: null },
      stimuli: _.shuffle(
        this.getSamples(2, concepts.concept2A.words, concepts.concept2A.title).concat(
        this.getSamples(2, concepts.concept2B.words, concepts.concept2B.title)))
    };
    // n = 20 : Practice
    let block3 = {
      leftConcepts: { first: concepts.concept1A.title, second: concepts.concept2A.title },
      rightConcepts: { first: concepts.concept1B.title, second: concepts.concept2B.title },
      stimuli: _.shuffle(
        this.getSamples(2, concepts.concept1A.words, concepts.concept1A.title).concat(
        this.getSamples(2, concepts.concept1B.words, concepts.concept1B.title)).concat(
        this.getSamples(2, concepts.concept2A.words, concepts.concept2A.title)).concat(
        this.getSamples(2, concepts.concept2B.words, concepts.concept2B.title)))
    };
    // n = 40 : Test
    let block4 = {
      leftConcepts: { first: concepts.concept1A.title, second: concepts.concept2A.title },
      rightConcepts: { first: concepts.concept1B.title, second: concepts.concept2B.title },
      stimuli: _.shuffle(
        this.getSamples(2, concepts.concept1A.words, concepts.concept1A.title).concat(
        this.getSamples(2, concepts.concept1B.words, concepts.concept1B.title)).concat(
        this.getSamples(2, concepts.concept2A.words, concepts.concept2A.title)).concat(
        this.getSamples(2, concepts.concept2B.words, concepts.concept2B.title)))
    };
    // n = 20 : Practice
    let block5 = {
      leftConcepts: { first: concepts.concept1B.title, second: null },
      rightConcepts: { first: concepts.concept1A.title, second: null },
      stimuli: _.shuffle(
        this.getSamples(2, concepts.concept1A.words, concepts.concept1A.title).concat(
        this.getSamples(2, concepts.concept1B.words, concepts.concept1B.title)))
    };
    // n = 20 : Practice
    let block6 = {
      leftConcepts: { first: concepts.concept1B.title, second: concepts.concept2A.title },
      rightConcepts: { first: concepts.concept1A.title, second: concepts.concept2B.title },
      stimuli: _.shuffle(
        this.getSamples(2, concepts.concept1A.words, concepts.concept1A.title).concat(
        this.getSamples(2, concepts.concept1B.words, concepts.concept1B.title)).concat(
        this.getSamples(2, concepts.concept2A.words, concepts.concept2A.title)).concat(
        this.getSamples(2, concepts.concept2B.words, concepts.concept2B.title)))
    };
    // n = 40 : Test
    let block7 = {
      leftConcepts: { first: concepts.concept1B.title, second: concepts.concept2A.title },
      rightConcepts: { first: concepts.concept1A.title, second: concepts.concept2B.title },
      stimuli: _.shuffle(
        this.getSamples(2, concepts.concept1A.words, concepts.concept1A.title).concat(
        this.getSamples(2, concepts.concept1B.words, concepts.concept1B.title)).concat(
        this.getSamples(2, concepts.concept2A.words, concepts.concept2A.title)).concat(
        this.getSamples(2, concepts.concept2B.words, concepts.concept2B.title)))
    };


    this.currentBlock = 0;
    this.testBlocks = [block1, block2, block3, block4, block5, block6, block7];
  }

  constructor(private nav: NavController, navParams: NavParams) {
    console.log("CTOR");

    this.navBackAlert_ = new NavBackAlert(nav, 'Training Canceled', 'Now exiting');

    this.createTestData();
    this.currentIndex = -1;
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
      return;
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

  private press(pressedButton: string) {
    console.log('Press ' + pressedButton);

    if (this.currentIndex === -1) {
      // Instruction screen - kick off
      this.nextExample();
      return;
    }

    console.log('this.currentStimuli.ofConcept: ' + this.currentStimuli.ofConcept);

    if ((pressedButton === 'LEFT'
    && (this.currentStimuli.ofConcept === this.testBlocks[this.currentBlock].leftConcepts.first
      || this.currentStimuli.ofConcept === this.testBlocks[this.currentBlock].leftConcepts.second))
      || (pressedButton === 'RIGHT'
      && (this.currentStimuli.ofConcept === this.testBlocks[this.currentBlock].rightConcepts.first
        || this.currentStimuli.ofConcept === this.testBlocks[this.currentBlock].rightConcepts.second))) {

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
