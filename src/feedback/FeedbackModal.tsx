import * as React from 'react';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/dom/ajax';
// import Modal from '../modal/Modal';
import './FeedbackModal.css';
import '../modal/Modal.css';
import Spinner from '../util/Spinner';
import toast from '../util/toast';
import { State } from '../redux/store';
import { connect } from 'react-redux';
import * as FeedbackAction from '../redux/action/feedback-action';
import { CONFIG } from '../config';

interface OwnState {
  feedback: string;
  email: string;
  spinner: boolean;
}

interface StateProps {
  color: Color;
  feedback: boolean;
}

interface DispatchProps {
  closeFeedback: () => void;
}

class FeedbackModal extends React.Component<StateProps & DispatchProps, OwnState> {
  private feedbackInput: any;

  constructor(props: any) {
    super(props);
    this.state = {
      email: '',
      feedback: '',
      spinner: false
    };

    if (this.props.feedback) {
      this.healthCheck();
    }
  }

  componentWillReceiveProps(nextProps: StateProps) {
    if (nextProps.feedback) {
      this.healthCheck();
    }
  }

  healthCheck() {
    Observable.ajax({
      url: CONFIG.URL + '/health',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET'
    })
    .subscribe(() => {
      ;
    });
  }

  submitAction() {
    this.setState({
      feedback: this.state.feedback,
      email: this.state.email,
      spinner: true
    });
    const data = {
      feedback: this.state.feedback,
      email: this.state.email
    };
    Observable.ajax({
      url: CONFIG.URL + '/feedback',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data)
    })
    .subscribe(() => {
      toast('Thank you for your feedback!');
      this.props.closeFeedback();
    }, () => {
      toast('An error occurred. Please try again later.');
      this.props.closeFeedback();
    }, () => {
      this.setState({
        email: '',
        feedback: '',
        spinner: false
      });
    });
  }

  textChanged(type: string, e: any) {
    const text = e.target.value;

    if (type === 'EMAIL') {
      this.setState({
        email: text,
        feedback: this.state.feedback,
        spinner: this.state.spinner
      });
    } else if (type === 'FEEDBACK') {
      this.setState({
        email: this.state.email,
        feedback: text,
        spinner: this.state.spinner
      });
    }

  }

  shouldComponentUpdate(nextProps: StateProps) {
    return this.props.feedback || !(this.props.feedback === nextProps.feedback);
  }

  render() {
    // const theme = this.props.color.theme;
    const backColor = 'botBack'; //(theme === 'dark') ? 'topBack' : 'botBack';
    const fullClass = 'small';

    const submitBtn = (
      <a
        className="actionBtn waves-effect waves-light btn"
        style={{ marginLeft: '26px' }}
        onClick={this.submitAction.bind(this)}
      >
        Submit
      </a>
    );

    const openClass = (this.props.feedback) ? 'open full-column' : '';

    return (
        <div className={backColor + ' ' + fullClass + ' ' + openClass + ' modal'}>
          <Spinner show={this.state.spinner} colorClass="topBack"/>
          <div className="textBack feedback-modal card-panel">
            <form>
              <div className="input-field">
                <input
                  className="textColor"
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
                  ref={(input) => { this.feedbackInput = input; }}
                  id="textarea1"
                  className="materialize-textarea textColor"
                  onChange={this.textChanged.bind(this, 'FEEDBACK')}
                  value={this.state.feedback}
                />
                <label htmlFor="textarea1">Feedback or Feature Requests</label>
              </div>
            </form>
          </div>
          <div className="btn-row">
            <a
              className="actionBtn waves-effect waves-light btn"
              onClick={this.props.closeFeedback.bind(this)}
            >
              Close
            </a>
            {submitBtn}
          </div>
        </div>
    );
  }
}


function mapStateToProps(store: State): StateProps {
  return {
    color: store.setting.color,
    feedback: store.feedback
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

