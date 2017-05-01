import * as React from 'react';
import './Board.css';
import * as Rx from 'rxjs';
import tranlsate from '../util/translation';
import BoardViewData, {State, ACTION_TYPES, BUTTON_TYPES} from './BoardViewData';
import {Color} from '../settings';
import {RxBaseComponent} from '../_base/RxBaseComponent';
import FoldableTextarea from '../util/FoldableTextarea';

export const INITIAL_BOARD_STATE: State = {
  text: '',
  error: undefined
};

interface Prop {
  color: Color; fontSize: number; viewData: BoardViewData;
}

export default class Board extends RxBaseComponent<Prop, State, BoardViewData> {
  private subscription: Rx.Subscription;

  constructor(props: any) {
    super(props.viewData, INITIAL_BOARD_STATE, props);
    this.subscription = Rx.Observable.merge(
      this.viewData.getUrlEncode$(),
      this.viewData.getUrlDecode$(),
      this.viewData.getEscape$(),
      this.viewData.getUnescape$(),
      this.viewData.getMinimize$(),
      this.viewData.getLink$()
    ).subscribe(this.systemTextChanged.bind(this));
  }

  systemTextChanged({ text, error }: { text: string; error?: string }) {
    this.viewData.nextAction({
      type: ACTION_TYPES.SYSTEM_TEXT_CHANGED,
      value: { text, error }
    });
  }

  // textChanged(e: any) {
    // const text = e.target.value;
  textChanged(text: string) {
    this.viewData.nextAction({
      type: ACTION_TYPES.TEXT_CHANGED,
      value: text
    });
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.subscription.unsubscribe();
  }

  buttonClicked(type: string) {
    this.viewData.buttonClicked(type);
  }



  calculateHeight(dom: any) {
    // if (this.refs.errorBoxRef) {
    //   return dom.clientHeight - this.refs.errorBoxRef.clientHeight;
    // }
    return dom.parentElement.clientHeight;
  }

  render() {
    const actionBtn = this.props.color.actionBtn;
    const textBack = this.props.color.textBack;
    const error = this.props.color.error;
    const textColor = this.props.color.textColor;
    // const secondaryColor = this.props.color.secondaryColor;

    const BUTTON_CLASS = actionBtn + ' waves-effect waves-light btn tooltipped';

    let errorDiv;
    if (this.state.error) {
      errorDiv = (
        <div className={error + ' flex-row word-wrap error-container z-depth-3'}>
          {this.state.error || ''}
        </div>
      );
    }

    const BUTTON_MAP = {
      [BUTTON_TYPES.FORMAT]: (<i className="material-icons">code</i>), // check
      [BUTTON_TYPES.MINIMIZE]: (<i className="material-icons">fullscreen_exit</i>), // min
      [BUTTON_TYPES.UNESCAPE]: (<i className="material-icons">format_quote</i>), // "
      [BUTTON_TYPES.URL_DECODE]: (<span>&</span>), // &
      [BUTTON_TYPES.ESCAPE]: (
        <span>
          <span className="material-icons slash">\</span><i className="material-icons slash-quote">format_quote</i>
        </span>
      ), // \"
      [BUTTON_TYPES.URL_ENCODE]: (<span>%</span>) // %
    };


    const buttons = [
      BUTTON_TYPES.FORMAT, // check
      BUTTON_TYPES.MINIMIZE, // min
      BUTTON_TYPES.UNESCAPE, // "
      BUTTON_TYPES.URL_DECODE, // &
      BUTTON_TYPES.ESCAPE, // \"
      BUTTON_TYPES.URL_ENCODE // %
    ].map((buttonType) => {
      return (
        <a
          className={BUTTON_CLASS}
          onClick={this.buttonClicked.bind(this, buttonType)}
          key={buttonType}
          data-position="right"
          data-delay="5"
          data-tooltip={tranlsate(buttonType)}
        >
          {BUTTON_MAP[buttonType]}
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
            <div className={textBack + ' card-panel full-column z-depth-4'}>
              <div className="full-column textarea-container" style={{color: textColor, fontSize: this.props.fontSize}}>
                {/*<textarea
                  style={{color: textColor, fontSize: this.props.fontSize}}
                  className="full-row"
                  onChange={this.textChanged.bind(this)}
                  value={this.state.text}
                />*/}
                <FoldableTextarea
                  color={this.props.color}
                  code={this.state.text}
                  onCodeChange={this.textChanged.bind(this)}
                  heightCalculation={this.calculateHeight.bind(this)}
                />
                  {/*className='full-height'*/}
              </div>
              {errorDiv}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

