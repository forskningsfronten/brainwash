import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import {TrainingPage} from '../training/training';

/*
  Generated class for the TrainingIntroPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/training-intro/training-intro.html',
})
export class TrainingIntroPage {
  constructor(private nav: NavController, private viewCtrl: ViewController) {}


  startTraining() {
    this.nav.push(TrainingPage)
      .then(() => {
        // Remove this page from the back nav stack
        const index = this.nav.indexOf(this.viewCtrl);
        this.nav.remove(index);
      });
  }
}
