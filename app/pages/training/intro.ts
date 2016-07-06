import { Component, ViewChild } from '@angular/core';
import { NavController, ViewController, Slides } from 'ionic-angular';
import {TrainingPage} from '../training/training';
import {SettingsStorage} from '../settings/settings-storage';

@Component({
  templateUrl: 'build/pages/training/intro.html',
})
export class TrainingIntroPage {
  @ViewChild('introSlider') slider: Slides;

  private skipIntroChecked: boolean;
  private settingsStorage = new SettingsStorage();

  constructor(private nav: NavController, private viewCtrl: ViewController) {
    this.settingsStorage
      .getValue(this.settingsStorage.showTrainingInstructionsKey)
      .then(val => {
        this.skipIntroChecked = !(val === 'true');
      });
  }

  skipIntroSettingToggle() {
    console.log("Skip intro toggle " + this.skipIntroChecked);
    this.settingsStorage.setValue(this.settingsStorage.showTrainingInstructionsKey, !this.skipIntroChecked)
  }

  startTraining() {
    this.nav.push(TrainingPage)
      .then(() => {
        // Remove this page from the back nav stack
        const index = this.nav.indexOf(this.viewCtrl);
        this.nav.remove(index);
      });
  }

  skipIntro() {
    this.slider.slideTo(this.slider.length() - 1, 500);
  }
}
