import * as React from 'react';
import './ActionBar.css';
import { connect } from 'react-redux';
import { State } from '../redux/store';
import * as BoardAction from '../redux/action/board-action';
import * as SettingAction from '../redux/action/setting-action';
import * as FeedbackAction from '../redux/action/feedback-action';
import * as DialogAction from '../redux/action/dialog-action';
import { CONFIG } from '../config';
// import { AVAILABLE_COLORS } from '../redux/reducer/setting-reducer';

const MAX_BOARD_COUNT = 2;
interface StateProps {
  color: Color;
  boardCount: number;
  feedback: boolean;
}

interface DispatchProps {
  addBoard: () => void;
  showFeedback: () => void;
  openSetting: () => void;
  openInfo: () => void;
  openDonation: () => void;
}

class ActionBar extends React.Component<StateProps & DispatchProps, {}> {

  render() {
    let addBoardButton;
    if (!this.props.feedback) {
      if (this.props.boardCount < MAX_BOARD_COUNT) {
        addBoardButton = (
          <a
            className="cyan btn-floating btn-large waves-effect waves-light"
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
          className="teal btn-floating btn-large waves-effect waves-light"
          onClick={this.props.showFeedback.bind(this)}
        >
          <i className="material-icons">feedback</i>
        </a>
      );
    }

    let infoBtn;
    if (CONFIG.FEATURE.INFO) {
      infoBtn = (
        <a
          className="indigo btn-floating btn-large waves-effect waves-light"
          onClick={this.props.openInfo.bind(this)}
        >
          <i className="material-icons">help</i>
        </a>
      );
    }

    let donationBtn;
    if (CONFIG.FEATURE.DONATION) {
      donationBtn = (
        <a
          className="orange btn-floating btn-large waves-effect waves-light"
          onClick={this.props.openDonation.bind(this)}
        >
          <i className="material-icons">attach_money</i>
        </a>
      )
    }

    return (
       <div className="action-buttons">
          {addBoardButton}
          {donationBtn}
          <a
            className="blue btn-floating btn-large waves-effect waves-light"
            onClick={this.props.openSetting.bind(this)}
          >
            <i className="material-icons">settings</i>
          </a>
          {infoBtn}
          {feedbackBtn}
        </div>
    );
  }

}

function mapStateToProps(store: State): StateProps {
  return {
    color: store.setting.color,
    boardCount: store.board.order.length,
    feedback: store.feedback
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    addBoard: () => {
      dispatch(BoardAction.addBoard());
    },
    showFeedback: () => {
      dispatch(FeedbackAction.showFeedback());
    },
    openSetting: () => {
      dispatch(SettingAction.openSetting());
    },
    openInfo: () => {
      dispatch(DialogAction.openInfo());
    },
    openDonation: () => {
      dispatch(DialogAction.openDonation());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionBar);
