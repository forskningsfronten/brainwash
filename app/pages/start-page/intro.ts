import { Component, ViewChild } from '@angular/core';
import { NavController, ViewController, Slides } from 'ionic-angular';
import {StartPage} from './start-page';
import {SettingsStorage} from '../settings/settings-storage';

@Component({
  templateUrl: 'build/pages/start-page/intro.html',
})
export class StartIntroPage {
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
    this.settingsStorage.setValue(this.settingsStorage.startInstructionsKey, !this.skipIntroChecked)
  }

  startTraining() {
    this.nav.push(StartPage)
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
