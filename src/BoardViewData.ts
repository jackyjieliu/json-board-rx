import * as jsonUtil from './json-util';
import * as Rx from 'rxjs';

export interface Action {
  type: string;
  value?: any;
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

export default class BoardViewData {
  public state$: Rx.Observable<State>;
  private action$: Rx.Subject<Action>;
  private buttonClick$: Rx.Subject<{ type: string; state: State; }>;

  constructor(initialState: State) {

    this.action$ = new Rx.Subject();
    this.buttonClick$ = new Rx.Subject();
    this.state$ = this.setupState(initialState);
  }

  nextAction(arg: any) {
    this.action$.next(arg);
  }

  buttonClicked(type: string, state: State) {
    this.buttonClick$.next({ type, state });
  }

  getLink$() {
    return this.buttonClick$
      .filter(({ type }) => type === BUTTON_TYPES.FORMAT)
      .map(({ state }) => {
        return state.text;
      })
      .filter((text) => !!text)
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
      .filter(({ type }) => type === BUTTON_TYPES.MINIMIZE)
      .map(({ state }) => {
        return state.text;
      })
      .filter((text) => !!text)
      .map((text) => jsonUtil.minify(text));
  }

  getUnescape$() {
    return this.buttonClick$
      .filter(({ type }) => type === BUTTON_TYPES.UNESCAPE)
      .map(({ state }) => {
        return state.text;
      })
      .filter((text) => !!text)
      .map((text) => jsonUtil.unescape(text));
  }

  getEscape$() {
    return this.buttonClick$
      .filter(({ type }) => type === BUTTON_TYPES.ESCAPE)
      .map(({ state }) => {
        return state.text;
      })
      .filter((text) => !!text)
      .map((text) => jsonUtil.escape(text));
  }

  getUrlDecode$() {
    return this.buttonClick$
      .filter(({ type }) => type === BUTTON_TYPES.URL_DECODE)
      .map(({ state }) => {
        return state.text;
      })
      .filter((text) => !!text)
      .map((text) => jsonUtil.urlDecode(text));
  }

  getUrlEncode$() {
    return this.buttonClick$
      .filter(({ type }) => type === BUTTON_TYPES.URL_ENCODE)
      .map(({ state }) => {
        return state.text;
      })
      .filter((text) => !!text)
      .map((text) => jsonUtil.urlEncode(text));
  }

  private setupState(initialState: State) {
    return this.action$
      .scan((state, action) => {
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
      }, initialState);
  }
}
