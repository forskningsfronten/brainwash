import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, Platform, MenuController, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {StartPage} from './pages/start-page/start-page';
import {StartIntroPage} from './pages/start-page/intro';
import {SettingsStorage} from './pages/settings/settings-storage';

@Component({
  templateUrl: 'build/app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  private settingsStorage = new SettingsStorage();
  rootPage: any;

  constructor(private platform: Platform) {
    this.initializeApp();

    this.settingsStorage
      .getValue(this.settingsStorage.startInstructionsKey)
      .then(val => {
        if (val === 'false')
          this.rootPage = StartPage;
        else
          this.rootPage = StartIntroPage;
      });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap(MyApp);
