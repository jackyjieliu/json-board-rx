import * as Rx from 'rxjs';

export interface Color {
  primary: string;
  lighten1: string;
  lighten4: string;
  lighten5: string;
  alertColor: string;
  errorColor: string;
}

const lightColors: Color[] = ['blue-grey', 'indigo', 'teal'].map((c) => {
  return {
    primary: c,
    lighten1: c + ' lighten-1',
    lighten4: c + ' lighten-4',
    lighten5: c + ' lighten-5',
    alertColor: 'red accent-2',
    errorColor: 'pink lighten-4'
  };
});

const darkColors: Color[] = ['blue-grey', 'grey'].map((c) => {
  return {
    primary: c,
    lighten1: c + ' darken-3',
    lighten4: c + ' darken-1',
    lighten5: c + ' darken-4',
    alertColor: 'red accent-2',
    errorColor: 'pink lighten-4'
  };
});

export const AVAILABLE_COLORS = lightColors.concat(darkColors);

export const DEFAULT_COLOR = AVAILABLE_COLORS[0];

class Settings {
  private color$: Rx.Subject<Color>;
  constructor() {
    this.color$ = new Rx.BehaviorSubject(DEFAULT_COLOR);
  }

  getColor$() {
    return this.color$;
  }

  newTheme(idx: number) {
    this.color$.next(AVAILABLE_COLORS[idx]);
  }
}



export default new Settings();