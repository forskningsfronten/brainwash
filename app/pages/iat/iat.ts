/// <reference path="../../../typings/modules/lodash/index.d.ts" />

import {Component} from '@angular/core';
import {NavController, NavParams, Animation, Alert} from 'ionic-angular';
import {StartPage} from '../start-page/start-page';
import * as _ from 'lodash';

@Component({
  templateUrl: 'build/pages/iat/iat.html'
})

export class IatPage {

  firstLeftCategory: string;
  firstRightCategory: string;
  secondLeftCategory: string;
  secondRightCategory: string;
  stimuli: string;


    leftPage: boolean;

    constructor(private nav: NavController, navParams: NavParams) {
        console.log("CTOR");

        this.firstLeftCategory = 'Kvinna';
        this.firstRightCategory = 'Man';
        this.secondLeftCategory = 'Vetenskap';
        this.secondRightCategory = 'Humaniora';
        this.stimuli = 'Kemi';
    }

    leftPress() {
      console.log('Left Press');
    }

    rightPress() {
      console.log('Right Press');
    }

    swipeLeftEvent($event) {
      console.log('swipe left');
    }

    swipeRightEvent($event) {
      console.log('swipe right');
    }

    confirmedExit: boolean = false;

    ionViewWillLeave() {
      if(!this.confirmedExit) {
        let confirm = Alert.create({
          title: 'IAT canceled',
          message: 'Now leaving',
          buttons: [{
            text: 'Ok',
            handler: () => {
              this.exitPage();
            }
          }]
        });
        this.nav.present(confirm);
      }
    }

    exitPage(){
      this.leftPage = true;
      this.confirmedExit = true;
      this.nav.remove().then(() => {
        this.nav.pop();
      });
    }
}
