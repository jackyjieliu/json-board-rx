import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './Board.css';
import tranlsate from '../util/translation';
import FoldableTextarea from '../util/FoldableTextarea';
import Spinner from '../util/Spinner';
import { connect } from 'react-redux';
import { State } from '../redux/store';
import * as BoardAction from '../redux/action/board-action';
import * as _ from 'lodash';
interface OwnProps {
  index: number;
}

interface StateProps {
  color: Color;
  fontSize: number;
  text: string;
  error?: string;
  boardCount: number;
  spinner: boolean;
}

interface DispatchProps {
  closeBoard: () =>  void;
  updateText: (text: string) =>  void;
  format: () => void;
  minify: () => void;
  unescape: () => void;
  escape: () => void;
  decode: () => void;
  encode: () => void;
}

const BUTTON_TYPES = {
  FORMAT: 'FORMAT',
  MINIMIZE: 'MINIMIZE',
  UNESCAPE: 'UNESCAPE',
  ESCAPE: 'ESCAPE',
  URL_DECODE: 'URL_DECODE',
  URL_ENCODE: 'URL_ENCODE',
  CLOSE: 'CLOSE'
};

class Board extends React.Component<StateProps & DispatchProps & OwnProps, {}> {
  private textareaRef: any;

  shouldComponentUpdate(nextProps: StateProps) {
    return !_.isEqual(nextProps, this.props);
  }

  componentDidUpdate(preProps: StateProps) {
    if (preProps.boardCount !== this.props.boardCount ||
      preProps.error !== this.props.error) {

      this.textareaRef.updateDimension();
    }
  }

  onTextUpdate(text: string) {
    this.props.updateText(text);
  }

  onPaste(e: any) {
    const pastedText = e.getData('text');
    const subStr = pastedText.slice(0, (pastedText.length) > 5 ? 5 : pastedText.length);
    const objIdx = subStr.indexOf('{');
    const arrIdx = subStr.indexOf('[');
    let shouldFormat = false;

    if (objIdx !== -1 && pastedText.charAt(objIdx + 1) !== '\\') {
      shouldFormat = true;
    } else if (arrIdx !== -1 && pastedText.charAt(arrIdx + 1) !== '\\') {
      shouldFormat = true;
    }

    if (shouldFormat) {
      // Only format if pasted string is JSON like
      setTimeout(() => {
        this.props.format();
      }, 0);
    }
  }

  calculateDimension(el: any) {
    const height = el.children[0].offsetHeight;
    const dom = ReactDOM.findDOMNode(this);
    const width = dom.clientWidth
      - 20  // margin left
      - 57  // padding left
      - 12  // padding right
      - 20; // margin right
    return {
      height, width
    };
  }

  render() {
    const BUTTON_CLASS = 'actionBtn waves-effect waves-light btn tooltipped';

    let errorDiv;
    if (this.props.error) {
      errorDiv = (
        <div className="errorColor flex-row word-wrap error-container z-depth-3">
          {this.props.error || ''}
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
      [BUTTON_TYPES.URL_ENCODE]: (<span>%</span>), // %
      [BUTTON_TYPES.CLOSE]: (<i className="material-icons">close</i>) // x
    };

    const BUTTON_CLICK_ACTIONS = {
      [BUTTON_TYPES.FORMAT]: this.props.format,
      [BUTTON_TYPES.MINIMIZE]: this.props.minify,
      [BUTTON_TYPES.UNESCAPE]: this.props.unescape,
      [BUTTON_TYPES.URL_DECODE]: this.props.decode,
      [BUTTON_TYPES.ESCAPE]: this.props.escape,
      [BUTTON_TYPES.URL_ENCODE]: this.props.encode,
      [BUTTON_TYPES.CLOSE]: this.props.closeBoard
    };

    const buttonConfig = [
      BUTTON_TYPES.FORMAT, // check
      BUTTON_TYPES.MINIMIZE, // min
      BUTTON_TYPES.UNESCAPE, // "
      BUTTON_TYPES.URL_DECODE, // &
      BUTTON_TYPES.ESCAPE, // \"
      BUTTON_TYPES.URL_ENCODE // %
    ];

    if (this.props.boardCount > 1) {
      buttonConfig.push(BUTTON_TYPES.CLOSE);
    }

    const buttons = buttonConfig.map((buttonType) => {
      return (
        <a
          className={BUTTON_CLASS}
          onClick={BUTTON_CLICK_ACTIONS[buttonType].bind(this)}
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
        <Spinner show={this.props.spinner} colorClass="topBack"/>
        <div className="vert-nav full-column">
          {buttons}
        </div>

        <div className="card-container full-row">
          <div className="card-textarea row full-row">
            <div className="textBack card-panel full-column z-depth-4">
              <div
                className="full-column textarea-container textColor"
                style={{fontSize: this.props.fontSize}}
              >
                <FoldableTextarea
                  ref={(el: any) => { this.textareaRef = this.textareaRef || el; }}
                  color={this.props.color}
                  code={this.props.text}
                  onCodeChange={this.onTextUpdate.bind(this)}
                  onPaste={this.onPaste.bind(this)}
                  calculateDimension={this.calculateDimension.bind(this)}
                />
              </div>
              {errorDiv}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(store: State, ownProps: OwnProps): StateProps {
  return {
    color: store.setting.color,
    fontSize: store.setting.fontSize,
    text: store.board.byId[ownProps.index].text,
    error: store.board.byId[ownProps.index].error,
    boardCount: store.board.order.length,
    spinner: store.board.byId[ownProps.index].spinner
  };
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: OwnProps): DispatchProps {
  const id = ownProps.index;
  return {
    closeBoard: () => {
      dispatch(BoardAction.removeBoard(id));
    },
    updateText: (text: string) => {
      dispatch(BoardAction.updateTextAction(id, text));
    },
    format: () => {
      dispatch(BoardAction.formatAction(id));
    },
    minify: () => {
      dispatch(BoardAction.minifyAction(id));
    },
    unescape: () => {
      dispatch(BoardAction.unescapeAction(id));
    },
    escape: () => {
      dispatch(BoardAction.escapeAction(id));
    },
    decode: () => {
      dispatch(BoardAction.decodeAction(id));
    },
    encode: () => {
      dispatch(BoardAction.encodeAction(id));
    }
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Board);

