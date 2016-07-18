import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {TrainingIntroPage} from '../training/intro';
import {TrainingPage} from '../training/training';
import {IatPage} from '../iat/iat';
import {IatIntroPage} from '../iat/intro';
import {SettingsPage} from '../settings/settings';
import {SettingsStorage} from '../settings/settings-storage';


@Component({
  templateUrl: 'build/pages/start-page/start-page.html'
})
export class StartPage {
  private settingsStorage = new SettingsStorage();

  constructor(private nav: NavController, navParams: NavParams) {
  }

  startTraining() {
    this.settingsStorage
      .getValue(this.settingsStorage.showTrainingInstructionsKey)
      .then(val => {
        if (val === 'false')
          this.nav.push(TrainingPage);
        else
          this.nav.push(TrainingIntroPage);
      });
  }

  startIAT() {
    this.settingsStorage
      .getValue(this.settingsStorage.showIATInstructionsKey)
      .then(val => {
        if (val === 'false')
          this.nav.push(IatPage);
        else
          this.nav.push(IatIntroPage);
      });
  }

  openSettings() {
    this.nav.push(SettingsPage);
  }
}
