import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {TrainingPage} from '../training/training';

@Component({
  templateUrl: 'build/pages/start-page/start-page.html'
})

export class StartPage {
  constructor(private nav: NavController, navParams: NavParams) {
  }

  startTraining() {
    this.nav.push(TrainingPage);
  }
}
