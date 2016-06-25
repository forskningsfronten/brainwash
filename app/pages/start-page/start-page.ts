import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {TrainingPage} from '../training/training';
import {IatPage} from '../iat/iat';

@Component({
  templateUrl: 'build/pages/start-page/start-page.html'
})

export class StartPage {
  constructor(private nav: NavController, navParams: NavParams) {
//    this.startIAT();
  }

  startTraining() {
    this.nav.push(TrainingPage);
  }

  startIAT() {
    this.nav.push(IatPage);
  }
}
