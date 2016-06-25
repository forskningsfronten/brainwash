import {NavController, Alert} from 'ionic-angular';

export class NavBackAlert {
  confirmedExit: boolean = false;
  public leavingPage = false;

  constructor(private nav: NavController, private title: string, private message: string) {
  }

  public showAlert() {
    if(this.confirmedExit)
      return;

    this.leavingPage = true;

    let confirm = Alert.create({
      title: this.title,
      message: this.message,
      buttons: [{
        text: 'Ok',
        handler: () => {
          this.confirmedExit = true;
          this.nav.remove().then(() => {
            this.nav.pop();
          });
        }
      }]
    });
    this.nav.present(confirm);
  }
}
