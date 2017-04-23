import * as React from 'react';
import './Board.css';
import * as Rx from 'rxjs';
import tranlsate from './translation';
import BoardViewData, {State, ACTION_TYPES, BUTTON_TYPES} from './BoardViewData';
import * as _ from 'lodash';
import {Color} from './settings';
import {RxBaseViewDataComponent} from './RxBaseComponent';

const INITIAL_STATE: State = {
  text: '',
  error: undefined
};

class Board extends RxBaseViewDataComponent<{ color: Color; fontSize: number; idx: number }, State, BoardViewData> {
  private subscriptions: Rx.Subscription[];

  constructor(props: any) {
    super(BoardViewData, INITIAL_STATE, props);
    this.subscriptions = [];

    _.bindAll(this, ['systemTextChanged']);

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

  textChanged(e: any) {
    const text = e.target.value;
    this.viewData.nextAction({
      type: ACTION_TYPES.TEXT_CHANGED,
      value: text
    });
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  buttonClicked(type: string) {
    this.viewData.buttonClicked(type);
  }

  render() {
    const actionBtn = this.props.color.actionBtn;
    const textBack = this.props.color.textBack;
    const error = this.props.color.error;
    const textColor = this.props.color.textColor;
    // const secondaryColor = this.props.color.secondaryColor;

    const BUTTON_CLASS = actionBtn + ' waves-effect waves-light btn';

    let errorDiv;
    if (this.state.error) {
      errorDiv = (
        <div className={error + ' flex-row word-wrap error-container z-depth-3'}>
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

    let diffButton;
    if (this.props.idx !== 0) {
      diffButton = (
        <a className={actionBtn + ' btn-floating btn-large waves-effect waves-light diff-button'}>
          <i className="material-icons">compare_arrows</i>
        </a>
      );
    }

    return (
      <div className="board">
        <div className="vert-nav full-column">
          {buttons}
        </div>

        <div className="card-container full-row">
          <div className="card-textarea row full-row">
            <div className={textBack + ' card-panel full-column z-depth-4'}>
              <div className="full-column textarea-container">
                <textarea
                  style={{color: textColor, fontSize: this.props.fontSize}}
                  className="full-row"
                  onChange={this.textChanged.bind(this)}
                  value={this.state.text}
                />
              </div>
              {errorDiv}
            </div>
          </div>
        </div>
        {diffButton}
      </div>
    );
  }
}


export default Board;
