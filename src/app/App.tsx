import * as React from 'react';
import './App.css';
import BoardContainer from '../board-container/BoardContainer';
import settings, {DEFAULT_COLOR, DEFAULT_FONT_SIZE} from '../settings';
import AppViewData, {State} from './AppViewData';
import {RxBaseViewDataComponent} from '../_base/RxBaseComponent';
import FeedbackModal from '../feedback/FeedbackModal';
import ActionBar from '../action/ActionBar';
// import * as _ from 'lodash';


const INITIAL_STATE = { color: DEFAULT_COLOR, fontSize: DEFAULT_FONT_SIZE , boards: 1, backdrop: false };

export default class App extends RxBaseViewDataComponent<null, State, AppViewData> {
  constructor(prop: any) {
    super(AppViewData, INITIAL_STATE, prop);

    settings.getColor$()
      .subscribe((color) => {
        this.viewData.nextAction({ type: 'COLOR', value: color});
      });
    settings.getFontSize$()
      .subscribe((fontSize) => {
        this.viewData.nextAction({ type: 'FONT_SIZE', value: fontSize});
      });
    settings.getBackdrop$()
      .subscribe((status) => {
        this.viewData.nextAction({ type: 'BACKDROP', value: status });
      });

  }

  setBoardCount(count: number) {
    this.viewData.nextAction({ type: 'BOARDS', value: count });
  }

  openFeedback() {
    this.viewData.nextAction({ type: 'FEEDBACK', value: true });
  }

  closeFeedback() {
    this.viewData.nextAction({ type: 'FEEDBACK', value: false });
  }

  render() {
    const topBack = this.state.color.topBack;
    const botBack = this.state.color.botBack;
    // const alertColor = this.props.color.alertColor;

    let feedback;
    if (this.state.feedback) {
      feedback = (
        <div className="feedback-container">
          <FeedbackModal
            fontSize={this.state.fontSize}
            color={this.state.color}
            onClose={this.closeFeedback.bind(this)}
          />
        </div>
      );
    }


    return (
      <div className="full-column">
        {feedback}
        <div className={topBack + ' top'}/>
        <div className={botBack + ' bot'}/>
        <BoardContainer
          color={this.state.color}
          fontSize={this.state.fontSize}
          boardCount={this.state.boards}
          backdrop={this.state.backdrop}
        />
        <ActionBar
          color={this.state.color}
          fontSize={this.state.fontSize}
          boardCount={this.state.boards}
          maxBoardCount={2}
          setBoardCount={this.setBoardCount.bind(this)}
          backdropShown={this.state.backdrop}
          closeFeedback={this.closeFeedback.bind(this)}
          openFeedback={this.openFeedback.bind(this)}
          feedbackOpened={this.state.feedback}
        />

      </div>
    );
  }
}
