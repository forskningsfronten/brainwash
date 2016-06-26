import { Component } from '@angular/core';
import { NavController, SqlStorage, Storage } from 'ionic-angular';
import { SettingsStorage } from './settings-storage';

@Component({
  templateUrl: 'build/pages/settings/settings.html',
})
export class SettingsPage {
  public settingsStore = new SettingsStorage();

  constructor(private nav: NavController) {
    this.settingsStore = new SettingsStorage();
  }

  toggleValue(key) {
    this.settingsStore.setValue(key, !this.settingsStore.values[key])
  }
}
