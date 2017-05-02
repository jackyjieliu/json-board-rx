import * as React from 'react';
import settings, {Color} from '../settings';
import './ActionBar.css';

interface Prop {
  color: Color;
  fontSize: number;
  boardCount: number;
  setBoardCount: (a: number) => void;
  maxBoardCount: number;
  backdropShown: boolean;
  feedbackOpened: boolean;
  openFeedback: () => void;
  closeFeedback: () => void;
}
export default class ActionBar extends React.Component<Prop, null> {

  setBoardCount(count: number) {
    this.props.setBoardCount(count);
  }

  openFeedback() {
    this.props.openFeedback();
  }

  changeColor(i: number) {
    settings.newTheme(i);
  }

  changeFont(font: number) {
    if (font < 36 && font > 6) {
      settings.setFontSize(font);
    }
  }

  render() {

    // const disp = this.props.color.disp;
    const actionBtn = this.props.color.actionBtn;
    let addBoardButton;
    if (!this.props.backdropShown) {
      if (this.props.boardCount < this.props.maxBoardCount) {
        addBoardButton = (
          <a
            className={actionBtn + ' btn-floating btn-large waves-effect waves-light'}
            onClick={this.setBoardCount.bind(this, this.props.boardCount + 1)}
          >
            <i className="material-icons">add</i>
          </a>
        );
      }
    }


    let feedbackBtn;
    if (!this.props.feedbackOpened) {
      feedbackBtn = (
        <a
          className={actionBtn + ' btn-floating btn-large waves-effect waves-light'}
          onClick={this.openFeedback.bind(this)}
        >
          <i className="material-icons">feedback</i>
        </a>
      );
    }

    return (
       <div className="action-buttons">
          {addBoardButton}
          {/*{rmBoardButton}*/}

          {/*<div className="fixed-action-btn horizontal">
            <a className={fontButton + ' btn-floating btn-large'}>
              <i className="material-icons">format_size</i>
            </a>
            <ul>
              <li>
                <a
                  className={fontButton + ' btn-floating'}
                  onClick={this.changeFont.bind(this, this.props.fontSize + 2)}
                >
                  <i className="material-icons">add</i>
                </a>
              </li>
              <li>
                <a
                  className={fontButton + ' btn-floating'}
                  onClick={this.changeFont.bind(this, this.props.fontSize - 2)}
                >
                  <i className="material-icons">remove</i>
                </a>
              </li>
            </ul>
          </div>*/}
          {/*<div className="fixed-action-btn horizontal">
            <a className={disp + ' btn-floating btn-large'}>
              <i className="material-icons">lens</i>
            </a>
            <ul>
              {
                AVAILABLE_COLORS.map((color, i) => {
                  return (
                    <li key={color.disp}>
                      <a className={color.disp + ' btn-floating'} onClick={this.changeColor.bind(this, i)}/>
                    </li>
                  );
                })
              }
            </ul>
          </div>*/}
          {feedbackBtn}
        </div>
    );
  }

}