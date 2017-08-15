import * as React from 'react';
// import Modal from '../modal/Modal';
import './InfoModal.css';
import '../modal/Modal.css';
import { State } from '../redux/store';
import { connect } from 'react-redux';
import * as DialogAction from '../redux/action/dialog-action';

interface StateProps {
  color: Color;
  opened: boolean;
}

interface DispatchProps {
  closeInfo: () => void;
}

const info = 'JSONPar.se is a tool that helps you parse, format, minify, unescape and decode JSON strings. ' +
  'It can also be used to compare different JSON strings.';

class FeedbackModal extends React.Component<StateProps & DispatchProps, {}> {

  render() {
    const backColor = 'botBack';
    const fullClass = 'small';
    const openClass = (this.props.opened) ? 'open full-column' : '';

    return (
        <div className={backColor + ' ' + fullClass + ' ' + openClass + ' modal'}>
          <div className="feedback-modal">
            <div className="card textBack">
              <div className="card-content textColor">
                <span className="card-title">JSONPar.se</span>
                <p>{info}</p>
              </div>
            </div>
          </div>
          <div className="btn-row">
            <a
              className="actionBtn waves-effect waves-light btn"
              onClick={this.props.closeInfo.bind(this)}
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
    opened: store.dialog.infoDialogOpened
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    closeInfo: () => {
      dispatch(DialogAction.closeInfo());
    }
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(FeedbackModal);

