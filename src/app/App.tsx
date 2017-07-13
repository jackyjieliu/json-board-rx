import * as React from 'react';
import './App.css';
import BoardContainer from '../board-container/BoardContainer';
import ActionBar from '../action/ActionBar';
import FeedbackModal from '../feedback/FeedbackModal';
import SettingModal from '../setting/SettingModal';
import ShareJsonModal from '../share-json/ShareJsonModal';
import InfoModal from '../info/InfoModal';
import DiffModal from '../diff/DiffModal';
import { connect } from 'react-redux';
import { State } from '../redux/store';
import { hideDiff } from '../redux/action/diff-action';
import { hideFeedback } from '../redux/action/feedback-action';
import { closeSetting } from '../redux/action/setting-action';
import { closeShareJson } from '../redux/action/share-json-action';
import { closeInfo } from '../redux/action/dialog-action';
import { initString, initJson } from '../redux/action/board-action';
import * as queryStringUtil from 'query-string';

const queryString = queryStringUtil.parse(location.search);

interface StateProps {
  color: Color;
  feedback: boolean;
  diff: boolean;
  settingOpened: boolean;
  shareJsonOpened: boolean;
}

interface DispatchProps {
  closeFeedback: () => void;
  closeDiff: () => void;
  closeSetting: () => void;
  closeShareJson: () => void;
  closeInfo: () => void;
  initJson: (storedId: string) => void;
  initString: (text: string) => void;
}

interface OwnProps {
  initObj: any;
}

class App extends React.Component<StateProps & DispatchProps & OwnProps, {}> {

  componentDidMount() {
    const storedId = location.pathname.split('/')[1];
    if (storedId) {
      this.props.initJson(storedId);
    } else if (queryString.j) {
      this.props.initString(queryString.j);
    }
  }

  render() {

    let overlay;
    if (this.props.feedback) {
      overlay = (
        <div className="modal-overlay" onClick={this.props.closeFeedback.bind(this)}/>
      );
    } else if (this.props.diff) {
      overlay = (
        <div className="modal-overlay" onClick={this.props.closeDiff.bind(this)}/>
      );
    } else if (this.props.settingOpened) {
      overlay = (
        <div className="modal-overlay" onClick={this.props.closeSetting.bind(this)}/>
      );
    } else if (this.props.shareJsonOpened) {
      overlay = (
        <div className="modal-overlay" onClick={this.props.closeShareJson.bind(this)}/>
      );
    }

    return (
      <div className="full-column" id={this.props.color.name}>
        {overlay}
        <div className="topBack top"/>
        <div className="botBack bot"/>
        <BoardContainer/>
        <ActionBar/>
        <FeedbackModal/>
        <SettingModal/>
        <DiffModal />
        <ShareJsonModal />
        <InfoModal />
      </div>
    );
  }
}

function mapStateToProps(store: State): StateProps {
  return {
    color: store.setting.color,
    feedback: store.feedback,
    diff: store.diff.show,
    settingOpened: store.setting.settingDialogOpened,
    shareJsonOpened: store.shareJson.dialogOpened
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    closeFeedback: () => {
      dispatch(hideFeedback());
    },
    closeDiff: () => {
      dispatch(hideDiff());
    },
    closeSetting: () => {
      dispatch(closeSetting());
    },
    initString: (str: string) => {
      dispatch(initString(str));
    },
    initJson: (str: string) => {
      dispatch(initJson(str));
    },
    closeShareJson: () => {
      dispatch(closeShareJson());
    },
    closeInfo: () => {
      dispatch(closeInfo());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

