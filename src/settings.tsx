import * as Rx from 'rxjs';

interface Color {
  primaryColor: string;
  secondaryColor: string;
  alertColor: string;
  errorColor: string;
}

const DEFAULT_COLOR = {
  primaryColor: 'indigo',
  secondaryColor: 'cyan',
  alertColor: 'red accent-2',
  errorColor: 'pink'
};

class Settings {
  private color$: Rx.Subject<Color>;
  constructor() {
    this.color$ = new Rx.BehaviorSubject(DEFAULT_COLOR);
  }

  getColor$() {
    return this.color$;
  }
}



export default new Settings();