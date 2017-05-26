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

    let overlay;
    if (this.props.feedback || this.props.diff) {
      overlay = (
        <div className="modal-overlay"/>
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

