/// <reference path="../../../typings/modules/lodash/index.d.ts" />

import {Component} from '@angular/core';
import {NavController, NavParams, ViewController, Animation, Alert} from 'ionic-angular';
import {StartPage} from '../start-page/start-page';
import {TrainingResultPage} from '../training/result';
import {SettingsStorage} from '../settings/settings-storage';
import {CancelablePromise, timeOutPromise} from '../core/promise-ext';
import {NavBackAlert} from '../core/ionic-nav-ext';
import {RandIdx} from '../core/rand-idx';
import * as _ from 'lodash';

export interface TrainingExample {
    word: string;
    image: string;
    counterStereotype: boolean;
}

export interface ITrainingExampleResult {
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
    playSound: boolean;
    correctResponse: boolean;
    timeout;

    createTestData() {
      let sciWords = ['Biologi', 'Fysik', 'Kemi', 'Matematik', 'Geologi', 'Astronomi', 'Vetenskap'];
      let artWords = ['Filosofi', 'Estetik', 'Dans', 'Teater', 'Litteratur', 'Musik', 'Historia'];
      let maleFaces = [
        'img/men/870101527_e6a1c571a1_o.jpg',
        'img/men/1799448232_deb1a9ba1d_o.jpg',
        'img/men/2580490890_8ebb4ae3e6_o.jpg',
        'img/men/2826993413_d68ec02c24_o.jpg',
        'img/men/3587074856_96d0e30cbd_o.jpg',
        'img/men/4445416757_dd697bb4b8_o.jpg',
        'img/men/5498091490_631c9f3a6b_o.jpg',
        'img/men/5914785828_4aedba37af_o.jpg',
        'img/men/5952683368_1734ff15ba_o.jpg',
        'img/men/6616957445_747408332a_o.jpg',
        'img/men/6848801076_bf8202342c_o.jpg',
        'img/men/9966523734_3e40dd53bd_o.jpg',
        'img/men/9966565236_0fa5a52928_o.jpg',
        'img/men/9966620903_cb46a2070c_o.jpg',
        'img/men/10068382145_3be2142550_o.jpg',
        'img/men/11341459815_c0dba9edd3_o.jpg',
        'img/men/14862101004_c0475fcb05_o.jpg',
        'img/men/15017791135_4bfdca2805_o.jpg',
        'img/men/14072643377_25cd7a8a4a_o.jpg',
        'img/men/7669708772_5b5bdd2eda_o_2.jpg'
      ];
      let femaleFaces = [
        'img/woman/443738371_15dbc126ed_o.jpg',
        'img/woman/13804043953_180f118146_o.jpg',
        'img/woman/21911141783_da1461550b_o.jpg',
        'img/woman/25171589413_0f43a33caa_o.jpg',
        'img/woman/25388788904_e75b07a890_o.jpg',
        'img/woman/25388972674_215e39fc55_o.jpg',
        'img/woman/25392591373_8868f65140_o.jpg',
        'img/woman/25392637613_ba27454c75_o.jpg',
        'img/woman/25497478040_570d4d3fd5_o.jpg',
        'img/woman/25720877500_a2dd9d1ff0_o.jpg',
        'img/woman/25720973070_8a35f34653_o.jpg',
        'img/woman/25900757772_438b6e4663_o.jpg',
        'img/woman/25900819672_9679758318_o.jpg',
        'img/woman/10050800605_645f91403a_o.jpg',
        'img/woman/10067707055_5ab38c752c_o.jpg',
        'img/woman/13069588075_3812ca1dfb_o.jpg',
        'img/woman/14209441301_54d10659a9_o.jpg',
        'img/woman/14370089486_aca543bfbc_o.jpg',
        'img/woman/14460234695_b1ecbba0f3_o.jpg',
        'img/woman/14488469810_02b7828ff6_o.jpg',
        'img/woman/14826094231_dfcd0d9f86_o.jpg',
        'img/woman/14955153745_877641c9e4_o.jpg',
        'img/woman/15385876310_2ce3a89e47_o.jpg',
        'img/woman/26336131024_c20ef948fe_o.jpg',
        'img/woman/2684974802_8c532c8e28_o.jpg',
        'img/woman/2977240917_a34b938c40_o.jpg',
        'img/woman/5238565943_335b63a582_o.jpg',
        'img/woman/5594811655_a6d4d49b56_o.jpg',
        'img/woman/7818379162_7a770cfe29_o.jpg',
        'img/woman/12468283154_00a9a54bbd_o.jpg',
        'img/woman/2930973727_532076d47e_o.jpg',
        'img/woman/6975202706_5a0940c1e4_o.jpg',
        'img/woman/12562412933_316a91e0e0_o.jpg',
        'img/woman/3186578380_3ab7462879_o.jpg',
        'img/woman/7272965350_8a7372031a_o.jpg',
        'img/woman/12562704154_2706990b95_o.jpg',
        'img/woman/4055596184_3c6da90142_o.jpg',
        'img/woman/73211534_92e5dcc863_o.jpg',
        'img/woman/1442771251_ac5d6cbd0b_o.jpg',
        'img/woman/4174606808_81cc563084_o.jpg',
        'img/woman/7669708772_5b5bdd2eda_o_1.jpg',
        'img/woman/16087628365_3e9b7e0f10_o.jpg',
        'img/woman/4699751323_6eb09ded2b_o.jpg',
        'img/woman/7669708772_5b5bdd2eda_o_2.jpg',
        'img/woman/19714953815_418f88da6a_o.jpg',
        'img/woman/4993282018_42c8437a26_o.jpg',
        'img/woman/8722314922_e0a678beb7_o.jpg',
        'img/woman/27758875280_d21e292239_o.jpg',
        'img/woman/6670338109_4239325ba0_o.jpg',
        'img/woman/2171012122_14866f39d1_o.jpg',
        'img/woman/couple-1363968_1920.jpg',
        'img/woman/girls-1487824_1920_2.jpg',
        'img/woman/246303761_68c4d0d747_o.jpg',
        'img/woman/couple-843489_1920.jpg',
        'img/woman/girls-1491989_1920.jpg',
        'img/woman/3539449735_a185491b57_o.jpg',
        'img/woman/dreadlocks-1169010_1920.jpg',
        'img/woman/horse-1341780_1920.jpg',
        'img/woman/4313735254_c7ea66d60a_o.jpg',
        'img/woman/girl-1327760_1920.jpg',
        'img/woman/mom-1330986_1920.jpg',
        'img/woman/4606525786_e6d71f80b5_o_1.jpg',
        'img/woman/girl-1364004_1920.jpg',
        'img/woman/mom-1330988_1920.jpg',
        'img/woman/4606525786_e6d71f80b5_o_2.jpg',
        'img/woman/girl-1454554_1920.jpg',
        'img/woman/son-1397810_1920.jpg',
        'img/woman/528049508_3e7a5fefa4_o.jpg',
        'img/woman/girl-1461631_1920.jpg',
        'img/woman/sunflower-834999_1920.jpg',
        'img/woman/578138309_252137572c_o.jpg',
        'img/woman/girl-1486728_1920.jpg',
        'img/woman/toddler-1312759_1920_1.jpg',
        'img/woman/6089468019_c48014b0f7_o_1.jpg',
        'img/woman/girl-1486739_1920.jpg',
        'img/woman/toddler-1312759_1920_2.jpg',
        'img/woman/6089468019_c48014b0f7_o_2.jpg',
        'img/woman/girl-1489429_1920.jpg',
        'img/woman/woman-1481747_1920.jpg',
        'img/woman/7543174724_93e7ba37b6_o.jpg',
        'img/woman/girl-1492615_1920.jpg',
        'img/woman/girls-1487824_1920_1.jpg'];

      let n = 36;

      let rand = new RandIdx();

      let testSet = Array(n/2).fill(0).map((_, idx) => (
        {
          word: sciWords[rand.getNum(sciWords.length)],
          image: femaleFaces[rand.getNum(femaleFaces.length)],
          counterStereotype: true
        }
      )).concat(new Array(n/6).fill(0).map((_, idx) => {
        return {
          word: artWords[rand.getNum(artWords.length)],
          image: femaleFaces[rand.getNum(femaleFaces.length)],
          counterStereotype: false
        };
      })).concat(new Array(n/6).fill(0).map((_, idx) => {
        return {
          word: sciWords[rand.getNum(sciWords.length)],
          image: maleFaces[rand.getNum(maleFaces.length)],
          counterStereotype: false
        };
      })).concat(new Array(n/6).fill(0).map((_, idx) => {
        return {
          word: artWords[rand.getNum(artWords.length)],
          image: maleFaces[rand.getNum(maleFaces.length)],
          counterStereotype: false
        };
      }));

      return _.shuffle(testSet);
    }


    private settingsStorage = new SettingsStorage();

    private navBackAlert_: NavBackAlert;

    constructor(private nav: NavController, private navParams: NavParams, private viewCtrl: ViewController) {
        console.log("CTOR");
        this.navBackAlert_ = new NavBackAlert(nav, 'Training Canceled', 'Now exiting');

        this.settingsStorage
          .getValue(this.settingsStorage.playTrainingSoundsKey)
          .then(val => {
            this.playSound = (val === 'true');
          });

        this.showCard = true;

        this.examples = this.createTestData();
        this.result = new Array<ITrainingExampleResult>();
        this.currentIndex = -1;
        this.nextExample(false);
    }

    showBlank() {
        console.log("showing blank");
        if (this.navBackAlert_.leavingPage)
          return;
        this.showCard = false;
        timeOutPromise(1000).then(() => {
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
        if (this.navBackAlert_.leavingPage)
          return;

        if (this.currentIndex == this.examples.length - 1) {
            // No more examples, training finished
            this.navBackAlert_ = null;

            this.nav.push(TrainingResultPage, {result: this.result})
              .then(() => {
                // Remove this page to make back go back to root from results page
                const index = this.nav.indexOf(this.viewCtrl);
                this.nav.remove(index);
              });
            return;
        }

        if (startWithBlank) {
            this.showBlank();
            return;
        }

        this.time = Date.now();
        this.currentIndex += 1;
        this.current = this.examples[this.currentIndex];
        this.timeout = new CancelablePromise(timeOutPromise(2000));
        this.timeout.promise
            .then(() => this.tapTimeOut())
            .catch((reason) => console.log('timeout canceled', reason.isCanceled));
    }

    tap() {
        console.log("TAP - cancelling timeout");

        console.log('play sound val: ' + this.playSound);
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
        if (this.navBackAlert_.leavingPage)
          return;

        this.correctResponse = correctResponse;
        this.showResult = true;
        timeOutPromise(500).then(() => {
            this.showResult = false;
            this.nextExample();
        });
    }

    ionViewWillLeave() {
      if (this.navBackAlert_)
        this.navBackAlert_.showAlert();
    }
}
