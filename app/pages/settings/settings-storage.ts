import { SqlStorage, Storage } from 'ionic-angular';

export class SettingsStorage {
  public startInstructionsKey = 'setting::start-instructions';
  public playTrainingSoundsKey = 'setting::training-sound';
  public showTrainingInstructionsKey = 'setting::training-instructions';
  public storeTrainingDataKey = 'setting::training-store-data';
  public showIATInstructionsKey = 'setting::iat-instructions';
  public storeIATDataKey = 'setting::iat-store-data';

  public values = new Map<string, boolean>();

  private storage_ = new Storage(SqlStorage);

  constructor() {
    this.storage_ = new Storage(SqlStorage);

    this.getOrSetDefault(this.startInstructionsKey, true);
    this.getOrSetDefault(this.playTrainingSoundsKey, true);
    this.getOrSetDefault(this.showTrainingInstructionsKey, true);
    this.getOrSetDefault(this.storeTrainingDataKey, true);
    this.getOrSetDefault(this.showIATInstructionsKey, true);
    this.getOrSetDefault(this.storeIATDataKey, true);
  }

  setValue(key, value) {
    console.log('Set value: ' + key + ' = ' + value);

    this.storage_.set(key, value);
    this.values[key] = value;
  }

  getValue(key) {
    return this.storage_.get(key);
  }

  private getOrSetDefault(key:string, defaultVal:boolean) {
    this.values[key] = defaultVal;

    return this.storage_.get(key)
    .then(storedVal => {
      if (storedVal == null) {
        this.storage_.set(key, defaultVal);
        this.values[key] = defaultVal;
      }
      this.values[key] = storedVal;
    });
  }
}
