import * as Rx from 'rxjs';

export interface Color {
  actionBtn: string;
  disp: string;
  topBack: string;
  botBack: string;
  textBack: string;
  error: string;
  textColor: string;
}

const lightColors: Color[] = ['blue-grey', 'indigo', 'teal'].map((c) => {
  return {
    actionBtn: c,
    disp: c + ' lighten-1',
    topBack: c + ' lighten-1',
    botBack: c + ' lighten-4',
    textBack: c + ' lighten-5',
    error: 'pink lighten-4',
    textColor: '#000'
  };
});

const darkColors: Color[] = ['blue-grey', 'grey'].map((c) => {
  return {
    actionBtn: c,
    disp: c + ' darken-3',
    topBack: c + ' darken-4',
    botBack: c + ' darken-3',
    textBack: c + ' darken-3',
    error: 'pink lighten-4',
    textColor: '#ccc'
  };
});

export const AVAILABLE_COLORS = lightColors.concat(darkColors);

export const DEFAULT_COLOR = AVAILABLE_COLORS[0];
export const DEFAULT_FONT_SIZE = 16;

class Settings {
  private color$: Rx.Subject<Color>;
  private fontSize$: Rx.Subject<number>;
  constructor() {
    this.color$ = new Rx.BehaviorSubject(DEFAULT_COLOR);
    this.fontSize$ = new Rx.BehaviorSubject(DEFAULT_FONT_SIZE);
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
}



export default new Settings();