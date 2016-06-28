import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {TrainingIntroPage} from '../training-intro/training-intro';
import {IatPage} from '../iat/iat';
import {SettingsPage} from '../settings/settings';

@Component({
  templateUrl: 'build/pages/start-page/start-page.html'
})

export class StartPage {
  constructor(private nav: NavController, navParams: NavParams) {
    //this.openSettings();
  }

  startTraining() {
    this.nav.push(TrainingIntroPage);
  }

  startIAT() {
    this.nav.push(IatPage);
  }

  openSettings() {
    this.nav.push(SettingsPage);
  }
}
