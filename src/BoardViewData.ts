import * as jsonUtil from './json-util';
import * as Rx from 'rxjs';
import RxBaseViewData, {Action} from './RxBaseViewData';

export interface ButtonClick {
  type: string;
}

export interface State {
  text: string;
  error?: string;
}

export const BUTTON_TYPES = {
  FORMAT: 'FORMAT',
  MINIMIZE: 'MINIMIZE',
  UNESCAPE: 'UNESCAPE',
  ESCAPE: 'ESCAPE',
  URL_DECODE: 'URL_DECODE',
  URL_ENCODE: 'URL_ENCODE'
};

export const ACTION_TYPES = {
  SYSTEM_TEXT_CHANGED: 'SYSTEM_TEXT_CHANGED',
  TEXT_CHANGED: 'TEXT_CHANGED'
};

export default class BoardViewData extends RxBaseViewData<State> {
  private buttonClick$: Rx.Subject<ButtonClick>;

  constructor(initialState: State) {
    super(initialState);
    this.buttonClick$ = new Rx.Subject();
  }

  buttonClicked(type: string) {
    this.buttonClick$.next({ type });
  }

  getLink$() {
    return this.buttonClick$
      .let(this.filterButtonActionAndMapText(BUTTON_TYPES.FORMAT))
      .map((text) => {
        const trimmedText = jsonUtil.removeNewLines(text);
        const beautified = jsonUtil.beautify(trimmedText, {
          'indent_size': 2,
          'indent_char': ' ',
          'indent_with_tabs': false
        });
        const linted = jsonUtil.lint(beautified);
        return linted;
      });
  }

  getMinimize$() {
    return this.buttonClick$
      .let(this.filterButtonActionAndMapText(BUTTON_TYPES.MINIMIZE))
      .map((text) => jsonUtil.minify(text));
  }

  getUnescape$() {
    return this.buttonClick$
      .let(this.filterButtonActionAndMapText(BUTTON_TYPES.UNESCAPE))
      .map((text) => jsonUtil.unescape(text));
  }

  getEscape$() {
    return this.buttonClick$
      .let(this.filterButtonActionAndMapText(BUTTON_TYPES.ESCAPE))
      .map((text) => jsonUtil.escape(text));
  }

  getUrlDecode$() {
    return this.buttonClick$
    .let(this.filterButtonActionAndMapText(BUTTON_TYPES.URL_DECODE))
      .map((text) => jsonUtil.urlDecode(text));
  }

  getUrlEncode$() {
    return this.buttonClick$
    .let(this.filterButtonActionAndMapText(BUTTON_TYPES.URL_ENCODE))
      .map((text) => jsonUtil.urlEncode(text));
  }

  reducer(state: State, action: Action) {

    switch (action.type) {
      case ACTION_TYPES.SYSTEM_TEXT_CHANGED:
        state.text = action.value.text;

        // Setting undefined will not clear, setting empty string will clear
        if (action.value.error !== undefined) {
          state.error = action.value.error || undefined;
        }

        break;
      case ACTION_TYPES.TEXT_CHANGED:
        state.text = action.value;

        break;
      default:
        break;
    }
    return state;
  }

  private filterButtonActionAndMapText(filterType: string) {
    return (obs$: Rx.Observable<ButtonClick>) => {
      return obs$.filter(({ type }) => type === filterType)
        .switchMap(() => {
          return this.state$.take(1);
        })
        .map(({ text }) => {
          return text;
        })
        .filter((text) => !!text);
    };
  }

}
