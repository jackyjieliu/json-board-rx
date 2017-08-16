import * as React from 'react';
// import Modal from '../modal/Modal';
import '../modal/Modal.css';
import { State } from '../redux/store';
import { connect } from 'react-redux';
import * as DialogAction from '../redux/action/dialog-action';

interface StateProps {
  color: Color;
  opened: boolean;
}

interface DispatchProps {
  closeDonation: () => void;
}

class DonationModal extends React.Component<StateProps & DispatchProps, {}> {

  render() {
    const backColor = 'botBack';
    const openClass = (this.props.opened) ? 'open full-column' : '';
    const donationLink = 'https://www.patreon.com/';

    return (
        <div className={backColor + ' ' + openClass + ' modal'} style={{ width: 560 }}>
          <div className="feedback-modal">
            <div className="card textBack">
              <div className="card-content textColor">
                <span className="card-title" style={{ marginBottom: 15 }}>Support JSONPar.se</span>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <a className="actionBtn waves-effect waves-light btn" href={donationLink} target="_blank">
                    via Pateron
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="btn-row">
            <a
              className="actionBtn waves-effect waves-light btn"
              onClick={this.props.closeDonation.bind(this)}
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
    opened: store.dialog.donationDialogOpened
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    closeDonation: () => {
      dispatch(DialogAction.closeDonation());
    }
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(DonationModal);

