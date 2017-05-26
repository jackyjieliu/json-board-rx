import * as React from 'react';
// import * as ReactDOM from 'react-dom';
import { State } from '../redux/store';
import { connect } from 'react-redux';
import * as DiffAction from '../redux/action/diff-action';
import DiffTextArea from '../util/DiffTextarea';
import './DiffModal.css';

interface StateProps {
  color: Color;
  fontSize: number;
  leftText: string;
  rightText: string;
  show: boolean;
}

interface DispatchProps {
  closeDiff: () => void;
}

class DiffModal extends React.Component<StateProps & DispatchProps, {}> {

  calculateDimension(el: any) {
    // const dom = ReactDOM.findDOMNode(this);
    const height = el.children[0].offsetHeight;
    const width = el.children[0].offsetWidth;
    // const height = dom.clientHeight
    //   - 24  // padding top
    //   - 24;  // padding bottom
    // const width = dom.clientWidth
    //   - 24  // padding left
    //   - 24;  // padding right
    return {
      height, width
    };
  }
  render() {
    const theme = this.props.color.theme;
    const backColor = (theme === 'dark') ? 'topBack' : 'botBack';
    const fullClass = 'full';

    const openClass = (this.props.show) ? 'open full-column' : '';
    let diffArea;
    if (this.props.show) {
      diffArea = (
        <DiffTextArea
          leftText={this.props.leftText}
          rightText={this.props.rightText}
          calculateDimension={this.calculateDimension.bind(this)}
        />
      );
    }

    return (
        <div className={backColor + ' ' + fullClass + ' ' + openClass + ' modal'}>
          <div className="textBack diff-modal full-column card-panel">
          {diffArea}
          </div>
          <div className="btn-row">
            <a
              className="actionBtn waves-effect waves-light btn"
              onClick={this.props.closeDiff.bind(this)}
            >
              Close
            </a>
          </div>
        </div>
    );
  }

}


function mapStateToProps(store: State): StateProps {
  return {
    color: store.setting.color,
    fontSize: store.setting.fontSize,
    leftText: store.board.byId[store.diff.leftIdx].text,
    rightText: store.board.byId[store.diff.rightIdx].text,
    show: store.diff.show
  };
}


function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    closeDiff: () => {
      dispatch(DiffAction.hideDiff());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DiffModal);