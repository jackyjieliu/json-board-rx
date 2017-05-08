import * as React from 'react';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/dom/ajax';
import {Color} from '../settings';
// import Modal from '../modal/Modal';
import './FeedbackModal.css';
import toast from '../util/toast';
import { State } from '../redux/store';
import { connect } from 'react-redux';
import * as FeedbackAction from '../redux/action/feedback-action';
interface OwnState {
  feedback: string;
  email: string;
}

interface StateProps {
  color: Color;
  fontSize: number;
}

interface DispatchProps {
  closeFeedback: () => void;
}

class FeedbackModal extends React.Component<StateProps & DispatchProps, OwnState> {
  private feedbackInput: any;

  submitAction() {
    // const data2 = [
    //   `entry.1597674574=${this.state.feedback}`,
    //   `entry.1342041182=${this.state.email}`
    // ].join('&');
    const data = {
      feedback: this.state.feedback,
      email: this.state.email
    };
    // Observable.ajax()
    //   .POST('http://localhost:3010', data, {'Content-type': 'application/json'})
    // var xhr = new XMLHttpRequest();
    // xhr.open('POST', url + '/formResponse', true);
    // xhr.setRequestHeader('Accept', 'application/xml, text/xml, */*; q=0.01');
    // xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
    // xhr.send(data2);
    Observable.ajax({
      // url: 'http://localhost:3010',
      url: 'https://json-board.herokuapp.com/feedback',
      // crossDomain: true,
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data)
    })
    // Observable.ajax('http://localhost:3010', data, { 'Content-type': 'application/json' })
    .subscribe(() => {
      toast('Thank you for your feedback!');
      this.props.closeFeedback();
    }, () => {
      toast('An error occurred. Please try again later.');
      this.props.closeFeedback();
    });
    // .subscribe({
    //   complete: () => {
    //     console.log('complete');
    //   }
    // });
  }

  textChanged(type: string, e: any) {
    const text = e.target.value;

    if (type === 'EMAIL') {
      this.setState({
        email: text,
        feedback: this.state.feedback
      });
    } else if (type === 'FEEDBACK') {
      this.setState({
        email: this.state.email,
        feedback: text
      });
    }

  }

  // TODO: auto grow
  // componentDidUpdate(prevProp: any, prevState: State) {
  //   if (prevState.feedback !== this.state.feedback) {
  //     $(this.feedbackInput).trigger('autoresize');
  //   }
  // }

  render() {
    const textBack = this.props.color.textBack;
    const textColor = this.props.color.textColor;

    // const textColor = this.props.color.textColor;
    // const theme = this.props.color.theme;

    //  /* label focus color */
    //  .input-field input[type=text]:focus + label {
    //    color: #000;
    //  }
    //  /* label underline focus color */
    //  .input-field input[type=text]:focus {
    //    border-bottom: 1px solid #000;
    //    box-shadow: 0 1px 0 0 #000;
    //  }

    const btnColor = this.props.color.actionBtn;
    const theme = this.props.color.theme;
    const backColor = (theme === 'dark') ? this.props.color.topBack : this.props.color.botBack;
    const fullClass = 'small';

    const submitBtn = (
      <a
        className={btnColor + ' waves-effect waves-light btn'}
        style={{ marginLeft: '26px' }}
        onClick={this.submitAction.bind(this)}
      >
        Submit
      </a>
    );
    return (


      <div className={fullClass + ' my-modal'}>
        <div className={backColor + ' modal full-column'}>
          <div className={textBack + ' feedback-modal card-panel'}>
            <form>
              <div className="input-field">
                <input
                  style={{color: textColor}}
                  id="email"
                  type="email"
                  value={this.state.email}
                  onChange={this.textChanged.bind(this, 'EMAIL')}
                  autoFocus={true}
                />
                <label htmlFor="email">Email (optional)</label>
              </div>
              <div className="input-field">
                <textarea
                  style={{color: textColor}}
                  ref={(input) => { this.feedbackInput = input; }}
                  id="textarea1"
                  className="materialize-textarea"
                  onChange={this.textChanged.bind(this, 'FEEDBACK')}
                  value={this.state.feedback}
                />
                <label htmlFor="textarea1">Feedback or Feature Requests</label>
              </div>
            </form>
          </div>
          <div className="btn-row">
            <a
              className={btnColor + ' waves-effect waves-light btn'}
              onClick={this.props.closeFeedback.bind(this)}
            >
              Close
            </a>
            {submitBtn}
          </div>
        </div>
        <div className="modal-overlay"/>;
      </div>
    );
  }
}


function mapStateToProps(store: State): StateProps {
  return {
    color: store.setting.color,
    fontSize: store.setting.fontSize
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    closeFeedback: () => {
      dispatch(FeedbackAction.hideFeedback());
    }
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(FeedbackModal);

