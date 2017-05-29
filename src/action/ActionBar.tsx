import * as React from 'react';
import './ActionBar.css';
import { connect } from 'react-redux';
import { State } from '../redux/store';
import * as BoardAction from '../redux/action/board-action';
import * as SettingAction from '../redux/action/setting-action';
import * as FeedbackAction from '../redux/action/feedback-action';
// import { AVAILABLE_COLORS } from '../redux/reducer/setting-reducer';

const MAX_BOARD_COUNT = 2;
// interface Prop {
//   color: Color;
//   fontSize: number;
//   boardCount: number;
//   setBoardCount: (a: number) => void;
//   maxBoardCount: number;
//   backdropShown: boolean;
//   feedbackOpened: boolean;
//   openFeedback: () => void;
//   closeFeedback: () => void;
// }

interface StateProps {
  color: Color;
  fontSize: number;
  boardCount: number;
  feedback: boolean;
}

interface DispatchProps {
  increaseFont: () => void;
  decreaseFont: () => void;
  changeTheme: (idx: number) => void;
  addBoard: () => void;
  showFeedback: () => void;
  openSetting: () => void;
}

class ActionBar extends React.Component<StateProps & DispatchProps, {}> {

  render() {
    let addBoardButton;
    if (!this.props.feedback) {
      if (this.props.boardCount < MAX_BOARD_COUNT) {
        addBoardButton = (
          <a
            className="actionBtn btn-floating btn-large waves-effect waves-light"
            onClick={this.props.addBoard.bind(this)}
          >
            <i className="material-icons">add</i>
          </a>
        );
      }
    }


    let feedbackBtn;
    if (!this.props.feedback) {
      feedbackBtn = (
        <a
          className="actionBtn btn-floating btn-large waves-effect waves-light"
          onClick={this.props.showFeedback.bind(this)}
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
                  onClick={this.props.increaseFont.bind(this)}
                >
                  <i className="material-icons">add</i>
                </a>
              </li>
              <li>
                <a
                  className={fontButton + ' btn-floating'}
                  onClick={this.props.decreaseFont.bind(this)}
                >
                  <i className="material-icons">remove</i>
                </a>
              </li>
            </ul>
          </div>*/}
          {/*<div className="fixed-action-btn horizontal">
            <a className="actionBtn btn-floating btn-large">
              <i className="material-icons disp-text-color">lens</i>
            </a>
            <ul>
              {
                AVAILABLE_COLORS.map((color, i) => {
                  return (
                    <li key={i}>
                      <a className="disp btn-floating" onClick={this.props.changeTheme.bind(this, i)}/>
                    </li>
                  );
                })
              }
            </ul>
          </div>*/}
          <a
            className="actionBtn btn-floating btn-large waves-effect waves-light"
            onClick={this.props.openSetting.bind(this)}
          >
            <i className="material-icons">settings</i>
          </a>
          {feedbackBtn}
        </div>
    );
  }

}

function mapStateToProps(store: State): StateProps {
  return {
    color: store.setting.color,
    fontSize: store.setting.fontSize,
    boardCount: store.board.order.length,
    feedback: store.feedback
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    increaseFont: () => {
      dispatch(SettingAction.increaseFontSize());
    },
    decreaseFont: () => {
      dispatch(SettingAction.decreaseFontSize());
    },
    changeTheme: (id: number) => {
      dispatch(SettingAction.changeTheme(id));
    },
    addBoard: () => {
      dispatch(BoardAction.addBoard());
    },
    showFeedback: () => {
      dispatch(FeedbackAction.showFeedback());
    },
    openSetting: () => {
      dispatch(SettingAction.openSetting());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionBar);
