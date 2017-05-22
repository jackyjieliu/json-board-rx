import * as React from 'react';
import './App.css';
import BoardContainer from '../board-container/BoardContainer';
import ActionBar from '../action/ActionBar';
import FeedbackModal from '../feedback/FeedbackModal';
import DiffModal from '../diff/DiffModal';
import { connect } from 'react-redux';
import { State } from '../redux/store';

interface StateProps {
  color: Color;
  fontSize: number;
  feedback: boolean;
  diff: boolean;
}

interface DispatchProps {}

class App extends React.Component<StateProps & DispatchProps, {}> {
  render() {
    const topBack = this.props.color.topBack;
    const botBack = this.props.color.botBack;
    // const alertColor = this.props.color.alertColor;

    let overlay;
    if (this.props.feedback || this.props.diff) {
      overlay = (
        <div className="modal-overlay"/>
      );
    }

    return (
      <div className="full-column">
        {overlay}
        <div className={topBack + ' top'}/>
        <div className={botBack + ' bot'}/>
        <BoardContainer/>
        <ActionBar/>
        <FeedbackModal/>
        <DiffModal />
      </div>
    );
  }
}

function mapStateToProps(store: State): StateProps {
  return {
    color: store.setting.color,
    fontSize: store.setting.fontSize,
    feedback: store.feedback,
    diff: store.diff.show
  };
}

function mapDispatchToProps(): DispatchProps {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

