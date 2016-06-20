import {Component} from '@angular/core';
import {NavController, NavParams, Animation, Alert} from 'ionic-angular';
import {StartPage} from '../start-page/start-page';

interface TrainingExample {
  topic: string;
  image: string;
  counterStereotype: boolean;
}
// Stimuli -> Timeout -> (Result Feedback) -> Blank -> Next Stimuli
//         -> Tap -> Result Feedback -> Blank -> Next Stimuli
@Component({
  templateUrl: 'build/pages/training/training.html'
})
export class TrainingPage {
  examples: TrainingExample[];
  current: TrainingExample;
  currentIndex: number;
  showCard: boolean;
  showResult : boolean;
  correctResponse : boolean;
  timeout;

  constructor(private nav: NavController, navParams: NavParams) {
    console.log("CTOR");

    this.showCard = true;
    let sciWords = ["Science", "Chemistry", "Math", "Geometry", "Engineering"];
    let artWords = ["Dance", "Theater", "Drama", "History", "Music"];
    this.examples = [
      { topic: 'Matematiker', image: 'img/2658969370_1.jpg', counterStereotype: true},
      { topic: 'Fysiker', image: 'img/2651953293_1.jpg', counterStereotype: true},
      { topic: 'Skådespelare', image: 'img/2666384408_1.jpg', counterStereotype: false},
      { topic: 'Programmerare', image: 'img/2652699508_1.jpg', counterStereotype: false}
    ];

    this.currentIndex = -1;
    this.nextExample(false);
  }

  showBlank() {
    console.log("showing blank");
    this.showCard = false;
    this.getTimeOut(1000).then(() => {
      console.log("showing blank - on to next");
      this.showCard = true;
      this.nextExample(false);
    });
  }

  tapTimeOut() {
    console.log("timedOut()");
    if (this.current.counterStereotype) {
      // Wrong response - should have tapped - show error
      console.log("Showing result (timeout) feedback");
      this.showResultFeedback(false);
    }
    else {
      // Correct response - no tap - move on
      this.nextExample();
    }
  }

  nextExample(startWithBlank = true) {
    console.log("nextExample()");

    if (this.currentIndex == this.examples.length - 1) {
      // No more examples, training finished
      this.nav.pop();
      return;
    }

    if (startWithBlank) {
      this.showBlank();
      return;
    }

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
      hasCanceled_ ? reject({isCanceled: true}) : resolve(val)
    );
    promise.catch((error) =>
      hasCanceled_ ? reject({isCanceled: true}) : reject(error)
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
