import * as React from 'react';
import './Board.css';
import * as Rx from 'rxjs';
import tranlsate from './translation';
import BoardViewData, {State, ACTION_TYPES, BUTTON_TYPES} from './BoardViewData';


const PRIMARY_COLOR = 'indigo';
const SECONDARY_COLOR = 'cyan';
const ERROR_COLOR = 'pink';

const INITIAL_STATE: State = {
  text: '',
  error: undefined
};

const BUTTON_CLASS = SECONDARY_COLOR + ' waves-effect waves-light btn';

class Board extends React.Component<{}, State> {
  private subscriptions: Rx.Subscription[];
  private viewData: BoardViewData;

  constructor(props: any) {
    super(props);
    this.state = INITIAL_STATE;
    this.viewData = new BoardViewData(INITIAL_STATE);
    this.subscriptions = [];

    const urlEncodeSub = this.viewData
      .getUrlEncode$()
      .subscribe(this.systemTextChanged);
    this.subscriptions.push(urlEncodeSub);

    const urlDecodeSub = this.viewData
      .getUrlDecode$()
      .subscribe(this.systemTextChanged);
    this.subscriptions.push(urlDecodeSub);

    const escapeSub = this.viewData
      .getEscape$()
      .subscribe(this.systemTextChanged);
    this.subscriptions.push(escapeSub);

    const unescapeSub = this.viewData
      .getUnescape$()
      .subscribe(this.systemTextChanged);
    this.subscriptions.push(unescapeSub);

    const minimizeSub = this.viewData
      .getMinimize$()
      .subscribe(this.systemTextChanged);
    this.subscriptions.push(minimizeSub);

    const linkSub = this.viewData
      .getLink$()
      .subscribe((linted) => {
        this.viewData.nextAction({
          type: ACTION_TYPES.SYSTEM_TEXT_CHANGED,
          value: {
            text: linted.json,
            error: linted.error || ''
          }
        });
      });
    this.subscriptions.push(linkSub);
  }

  systemTextChanged(text: string) {
    this.viewData.nextAction({
      type: ACTION_TYPES.SYSTEM_TEXT_CHANGED,
      value: { text }
    });
  }

  textChange(e: any) {
    const text = e.target.value;
    this.viewData.nextAction({
      type: ACTION_TYPES.TEXT_CHANGED,
      value: text
    });
  }

  componentDidMount() {
    const stateSub = this.viewData.state$
      .subscribe(newState => {
        this.setState(newState);
      });
    this.subscriptions.push(stateSub);
  }

  componentWillUnmount() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  buttonClicked(type: string) {
    this.viewData.buttonClicked(type, this.state);
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

    const buttons = [
      BUTTON_TYPES.FORMAT,
      BUTTON_TYPES.MINIMIZE,
      BUTTON_TYPES.UNESCAPE,
      BUTTON_TYPES.URL_DECODE,
      BUTTON_TYPES.ESCAPE,
      BUTTON_TYPES.URL_ENCODE
    ].map((buttonType) => {
      return (
        <a className={BUTTON_CLASS} onClick={this.buttonClicked.bind(this, buttonType)} key={buttonType}>
          {tranlsate(buttonType)}
        </a>
      );
    });

    return (
      <div className="board">
        <div className="vert-nav full-column">
          {buttons}
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


export default Board;
