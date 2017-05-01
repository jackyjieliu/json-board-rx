import * as Rx from 'rxjs';

export interface Color {
  actionBtn: string;
  disp: string;
  topBack: string;
  botBack: string;
  textBack: string;
  error: string;
  textColor: string;
  theme: string;
}

// const lightColors: Color[] = ['blue-grey', 'indigo', 'teal'].map((c) => {
//   return {
//     actionBtn: c,
//     disp: c + ' lighten-1',
//     topBack: c + ' lighten-1',
//     botBack: c + ' lighten-4',
//     textBack: c + ' lighten-5',
//     error: 'pink lighten-4',
//     textColor: '#000',
//     theme: 'light'
//   };
// });

// const darkColors: Color[] = ['blue-grey', 'grey'].map((c) => {
//   return {
//     actionBtn: c,
//     disp: c + ' darken-3',
//     topBack: c + ' darken-4',
//     botBack: c + ' darken-3',
//     textBack: c + ' darken-3',
//     error: 'pink lighten-4',
//     textColor: '#ccc',
//     theme: 'dark'
//   };
// });

// export const AVAILABLE_COLORS = lightColors.concat(darkColors);
export const AVAILABLE_COLORS = [{
  actionBtn: 'grey darken-2',
  disp: 'grey lighten-2',
  topBack: 'grey',
  botBack: 'grey lighten-1',
  textBack: 'grey lighten-3',
  error: 'pink lighten-5',
  textColor: '#000',
  theme: 'light'
}];

export const DEFAULT_COLOR = AVAILABLE_COLORS[0];
export const DEFAULT_FONT_SIZE = 16;

class Settings {
  private color$: Rx.Subject<Color>;
  private fontSize$: Rx.Subject<number>;
  private backdrop$: Rx.Subject<boolean>;
  constructor() {
    this.color$ = new Rx.BehaviorSubject(DEFAULT_COLOR);
    this.fontSize$ = new Rx.BehaviorSubject(DEFAULT_FONT_SIZE);
    this.backdrop$ = new Rx.BehaviorSubject(false);
  }

  getColor$() {
    return this.color$;
  }

  newTheme(idx: number) {
    this.color$.next(AVAILABLE_COLORS[idx]);
  }

  getFontSize$() {
    return this.fontSize$;
  }

  setFontSize(size: number) {
    this.fontSize$.next(size);
  }

  getBackdrop$() {
    return this.backdrop$;
  }

  backdropShown() {
    this.backdrop$.next(true);
  }

  backdropHidden() {
    this.backdrop$.next(false);
  }
}

export default new Settings();