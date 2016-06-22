/// <reference path="../../../typings/modules/lodash/index.d.ts" />

import {Component} from '@angular/core';
import {NavController, NavParams, Animation, Alert} from 'ionic-angular';
import {StartPage} from '../start-page/start-page';
import * as _ from 'lodash';

interface TrainingExample {
    word: string;
    image: string;
    counterStereotype: boolean;
}

interface ITrainingExampleResult {
  example: TrainingExample;
  tapTime: number; // ms from stimuli exposure to tap (or null if no tap)
}
// Stimuli -> Timeout -> (Result Feedback) -> Blank -> Next Stimuli
//         -> Tap -> Result Feedback -> Blank -> Next Stimuli
@Component({
  templateUrl: 'build/pages/training/training.html'
})
export class TrainingPage {
    examples: TrainingExample[];
    result: ITrainingExampleResult[];
    current: TrainingExample;
    time: number;
    currentIndex: number;
    showCard: boolean;
    showResult: boolean;
    correctResponse: boolean;
    timeout;
    leftPage: boolean;

    randIdx(length:number) {
      return Math.floor(Math.random() * length);
    }

    createTestData() {
      let sciWords = ["Science", "Chemistry", "Math", "Geometry", "Engineering"];
      let artWords = ["Dance", "Theater", "Drama", "History", "Music"];
      let maleFaces = ['img/2666384408_1.jpg', 'img/2652699508_1.jpg', 'img/10697993_1.jpg', 'img/20315024_1.jpg', 'img/100040721_2.jpg'];
      let femaleFaces = ['img/2658969370_1.jpg', 'img/2651953293_1.jpg', 'img/1629243_1.jpg', 'img/30844800_1.jpg', 'img/114530171_1.jpg'];

      let testSet = Array(18).fill(0).map((_, idx) => (
        {
          word: sciWords[this.randIdx(sciWords.length)],
          image: femaleFaces[this.randIdx(femaleFaces.length)],
          counterStereotype: true
        }
      )).concat(new Array(6).fill(0).map((_, idx) => {
        return {
          word: artWords[this.randIdx(artWords.length)],
          image: femaleFaces[this.randIdx(femaleFaces.length)],
          counterStereotype: false
        };
      })).concat(new Array(6).fill(0).map((_, idx) => {
        return {
          word: sciWords[this.randIdx(sciWords.length)],
          image: maleFaces[this.randIdx(maleFaces.length)],
          counterStereotype: false
        };
      })).concat(new Array(6).fill(0).map((_, idx) => {
        return {
          word: artWords[this.randIdx(artWords.length)],
          image: maleFaces[this.randIdx(maleFaces.length)],
          counterStereotype: false
        };
      }));

      return _.shuffle(testSet);
    }

    constructor(private nav: NavController, navParams: NavParams) {
        console.log("CTOR");
        this.leftPage = false;
        this.showCard = true;

        this.examples = this.createTestData();
        this.result = new Array<ITrainingExampleResult>();
        this.currentIndex = -1;
        this.nextExample(false);
    }

    showBlank() {
        console.log("showing blank");
        if (this.leftPage)
          return;
        this.showCard = false;
        this.getTimeOut(1000).then(() => {
            console.log("showing blank - on to next");
            this.showCard = true;
            this.nextExample(false);
        });
    }

    tapTimeOut() {
        console.log("timedOut()");
        this.result.push({
          example: this.current,
          tapTime: null
        });
        this.nextExample();
        // TODO should we show response on timeout?
        // Probably not...
        // if (this.current.counterStereotype) {
        //     // Wrong response - should have tapped - show error
        //     console.log("Showing result (timeout) feedback");
        //     this.showResultFeedback(false);
        // }
        // else {
        //     // Correct response - no tap - move on
        //     this.nextExample();
        // }
    }

    nextExample(startWithBlank = true) {
        console.log("nextExample()");
        if (this.leftPage)
          return;

        if (this.currentIndex == this.examples.length - 1) {
            // No more examples, training finished
            this.nav.pop();
            return;
        }

        if (startWithBlank) {
            this.showBlank();
            return;
        }

        this.time = Date.now();
        this.currentIndex += 1;
        this.current = this.examples[this.currentIndex];
        this.timeout = this.makeCancelable(this.getTimeOut(2000));
        this.timeout
            .promise
            .then(() => this.tapTimeOut())
            .catch((reason) => console.log('timeout canceled', reason.isCanceled));
    }

    tap() {
        console.log("TAP - cancelling timeout");

        if (this.showResult) {
            console.log("tap while showing result doesn't count");
            return;
        }

        let delay = Date.now() - this.time;
        console.log('Tap after: ' + delay + ' ms');

        this.result.push({
          example: this.current,
          tapTime: delay
        });

        this.timeout.cancel();

        if (this.current.counterStereotype) {
            // Correct response - tap on counter stereotype - show positive response
            console.log('Correct response - tap on counter stereotype - show positive response');
            this.showResultFeedback(true);
        }
        else {
            // Wrong response - tap on stereotype - show negative response
            console.log('Wrong response - tap on stereotype - show negative response');
            this.showResultFeedback(false);
        }
    }

    showResultFeedback(correctResponse: boolean) {
        if (this.leftPage)
          return;

        this.correctResponse = correctResponse;
        this.showResult = true;
        this.getTimeOut(500).then(() => {
            this.showResult = false;
            this.nextExample();
        });
    }

    getTimeOut(ms: number) {
        return new Promise(r => setTimeout(r, ms));
    }

    ionViewWillLeave() {
      this.leftPage = true;
      let alert = Alert.create({
            title: 'Training canceled',
            subTitle: 'Statistics recorded during this session has been discarded.',
            buttons: ['OK']
        });
        //this.nav.present(alert);
    }

    makeCancelable(promise) {
        let hasCanceled_ = false;

        const wrappedPromise = new Promise((resolve, reject) => {
            promise.then((val) =>
                hasCanceled_ ? reject({ isCanceled: true }) : resolve(val)
            );
            promise.catch((error) =>
                hasCanceled_ ? reject({ isCanceled: true }) : reject(error)
            );
        });

        return {
            promise: wrappedPromise,
            cancel() {
                hasCanceled_ = true;
            },
        };
    };

}
