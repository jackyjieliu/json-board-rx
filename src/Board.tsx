import * as React from 'react';
import './Board.css';
import * as Rx from 'rxjs';
import { js_beautify as jsBeautify } from 'js-beautify';
import * as jsonlint from 'json-lint';
import * as minify from 'jsonminify';

const PRIMARY_COLOR = 'indigo';
const SECONDARY_COLOR = 'cyan';
const ERROR_COLOR = 'pink';

interface State {
  text: string;
  error?: string;
}

const INITIAL_STATE: State = {
  text: '',
  error: undefined
};

const BUTTON_CLASS = SECONDARY_COLOR + ' waves-effect waves-light btn';

class Board extends React.Component<{}, State> {
  private state$: Rx.Observable<State>;
  private action$: Rx.Subject<{ type: string, value?: any }>;
  private buttonClick$: Rx.Subject<{ type: string; state: State; }>;
  private subscription: Rx.Subscription;

  constructor(props: any) {
    super(props);

    this.action$ = new Rx.Subject();
    this.buttonClick$ = new Rx.Subject();
    this.state$ = this.action$
      .scan((state, action) => {
        switch (action.type) {
          case 'SYSTEM_TEXT_CHANGED':
            state.text = action.value.text;

            // Setting undefined will not clear, setting empty string will clear
            if (action.value.error !== undefined) {
              state.error = action.value.error || undefined;
            }

            break;
          case 'TEXT_CHANGED':
            state.text = action.value;

            break;
          default:
            break;
        }
        return state;
      }, INITIAL_STATE);

    this.state = INITIAL_STATE;

    this.buttonClick$
      .filter(({ type }) => type === 'FORMAT')
      .map(({ state }) => {
        return state.text;
      })
      .filter((text) => !!text)
      .map((text) => {
        return jsBeautify(removeNewLines(text), {
          'indent_size': 2,
          'indent_char': ' ',
          'indent_with_tabs': false
        });
      })
      .map(text => {
        const jsonLintResult: {
          json: string;
          error?: string;
          evidence?: string;
        } = jsonlint(text);
        return jsonLintResult;
      })
      .subscribe((jsonlintObj) => {
        this.action$.next({
          type: 'SYSTEM_TEXT_CHANGED',
          value: {
            text: jsonlintObj.json,
            error: jsonlintObj.error || ''
          }
        });
      });

    this.buttonClick$
      .filter(({ type }) => type === 'MINIMIZE')
      .map(({ state }) => {
        return state.text;
      })
      .filter((text) => !!text)
      .map((text) => minify(text))
      .subscribe((text) => {
        this.action$.next({
          type: 'SYSTEM_TEXT_CHANGED',
          value: { text }
        });
      });


    this.buttonClick$
      .filter(({ type }) => type === 'UNESCAPE')
      .map(({ state }) => {
        return state.text;
      })
      .filter((text) => !!text)
      .map((text) => unescape(text))
      .subscribe((text) => {
        this.action$.next({
          type: 'SYSTEM_TEXT_CHANGED',
          value: { text }
        });
      });


    this.buttonClick$
      .filter(({ type }) => type === 'ESCAPE')
      .map(({ state }) => {
        return state.text;
      })
      .filter((text) => !!text)
      .map((text) => escape(text))
      .subscribe((text) => {
        this.action$.next({
          type: 'SYSTEM_TEXT_CHANGED',
          value: { text }
        });
      });


    this.buttonClick$
      .filter(({ type }) => type === 'URL_DECODE')
      .map(({ state }) => {
        return state.text;
      })
      .filter((text) => !!text)
      .map((text) => urlDecode(text))
      .subscribe((text) => {
        this.action$.next({
          type: 'SYSTEM_TEXT_CHANGED',
          value: { text }
        });
      });

    this.buttonClick$
      .filter(({ type }) => type === 'URL_ENCODE')
      .map(({ state }) => {
        return state.text;
      })
      .filter((text) => !!text)
      .map((text) => urlEncode(text))
      .subscribe((text) => {
        this.action$.next({
          type: 'SYSTEM_TEXT_CHANGED',
          value: { text }
        });
      });
  }


  textChange(e: any) {
    const text = e.target.value;
    this.action$.next({
      type: 'TEXT_CHANGED',
      value: text
    });
  }

  componentDidMount() {
    this.subscription = this.state$
      .subscribe(newState => {
        this.setState(newState);
      });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }


  buttonClicked(type: string) {
    this.buttonClick$.next({ type, state: this.state });
  }

  render() {
    let errorDiv;
    if (this.state.error) {
      errorDiv = (
        <div className={ERROR_COLOR + ' flex-row word-wrap lighten-4 error-container'}>
          {this.state.error || ''}
        </div>
      );
    }

    return (
      <div className="board">
        <div className="vert-nav full-column">
          <a className={BUTTON_CLASS} onClick={this.buttonClicked.bind(this, 'FORMAT')}>
            Format
          </a>

          <a className={BUTTON_CLASS} onClick={this.buttonClicked.bind(this, 'MINIMIZE')}>
            Minimize
          </a>

          <a className={BUTTON_CLASS} onClick={this.buttonClicked.bind(this, 'UNESCAPE')}>
            Unescape
          </a>

          <a className={BUTTON_CLASS} onClick={this.buttonClicked.bind(this, 'URL_DECODE')}>
            Url Decode
          </a>

          <a className={BUTTON_CLASS} onClick={this.buttonClicked.bind(this, 'ESCAPE')}>
            Escape
          </a>

          <a className={BUTTON_CLASS} onClick={this.buttonClicked.bind(this, 'URL_ENCODE')}>
            Url Encode
          </a>
        </div>

        <div className="card-container full-row">
          <div className="card-textarea row full-row">
            <div className={PRIMARY_COLOR + ' lighten-5 card-panel full-column z-depth-4'}>
              <div className="full-column textarea-container">
                <textarea className="full-row" onChange={this.textChange.bind(this)} value={this.state.text}/>
              </div>
              {errorDiv}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function removeNewLines(str: string) {
  return (str).replace(/\r?\n|\r/g, '');
}

function escape (str: string) {
  return ('' + str).replace(/["'\\\n\r\u2028\u2029]/g, (character: string) => {
    switch (character) {
      case '"':
      case '\'':
      case '\\':
        return '\\' + character;
      case '\n':
        return '\\n';
      case '\r':
        return '\\r';
      case '\u2028':
        return '\\u2028';
      case '\u2029':
        return '\\u2029';
      default:
        return '';
    }
  });
}

function unescape (str: string) {
  return ('' + str).replace(/\\./g, (character: string) => {
    switch (character) {
      case '\\"':
        return '"';
      case '\\\'':
        return '\'';
      case '\\\\':
        return '\\';
      case '\\n':
        return '\n';
      case '\\r':
        return '\r';
      case '\\u2028':
        return '\u2028';
      case '\\u2029':
        return '\u2029';
      default:
        return '';
    }
  });
}

function urlEncode(str: string) {
  return encodeURIComponent(str).replace(/'/g, '%27').replace(/"/g, '%22');
}

function urlDecode(str: string) {
  return decodeURIComponent(str.replace(/\+/g,  ' '));
}

export default Board;
