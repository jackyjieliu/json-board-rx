import * as React from 'react';
import * as Rx from 'rxjs';
import {Color} from '../settings';
import Modal from '../modal/Modal';
import './FeedbackModal.css';
import {RxBaseViewDataComponent} from '../_base/RxBaseComponent';
import FeedbackModalViewData, {State} from './FeedbackModalViewData';
interface Prop {
  color: Color;
  fontSize: number;
  onClose: () => void;
}


export default class FeedbackModal extends RxBaseViewDataComponent<Prop, State, FeedbackModalViewData> {
  private feedbackInput: any;
  constructor(props: any) {
    super(FeedbackModalViewData, { feedback: '', email: '' }, props);
  }

  submitAction() {
    // const data2 = [
    //   `entry.1597674574=${this.state.feedback}`,
    //   `entry.1342041182=${this.state.email}`
    // ].join('&');
    const data = {
      'entry.1597674574': this.state.feedback,
      'entry.1342041182': this.state.email
    };
    const url = 'https://docs.google.com/forms/d/1P_8XAplponW7wZUviOnUjkLxmG3uZKsdh_er3vozSKg';

    // var xhr = new XMLHttpRequest();
    // xhr.open('POST', url + '/formResponse', true);
    // xhr.setRequestHeader('Accept', 'application/xml, text/xml, */*; q=0.01');
    // xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
    // xhr.send(data2);
    Rx.Observable.ajax({
      url: url + '/formResponse',
      crossDomain: true,
      headers: {
        'Accept': 'application/xml, text/xml, */*; q=0.01',
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      method: 'POST',
      body: data,
      createXHR: function () {
        return new XMLHttpRequest();
      }
    })
    .catch(err => Rx.Observable.of(err))
    .subscribe(() => {
      this.props.onClose();
    });
    // .subscribe({
    //   complete: () => {
    //     console.log('complete');
    //   }
    // });
  }

  textChanged(type: string, e: any) {
    const text = e.target.value;
    this.viewData.nextAction({
      type,
      value: text
    });
  }

  componentDidMount() {
    super.componentDidMount();
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
    return (
      <Modal color={this.props.color} onClose={this.props.onClose} onSubmit={this.submitAction.bind(this)} full={false}>
        <div className={textBack + ' feedback-modal card-panel'}>
          <form>
            <div className="input-field">
              <input
                style={{color: textColor}}
                id="email"
                type="email" value={this.state.email}
                onChange={this.textChanged.bind(this, 'EMAIL')}
                autoFocus={true}
              />
              <label htmlFor="email">Email</label>
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
              <label htmlFor="textarea1">Feedback or Freature Requests</label>
            </div>
          </form>
        </div>
      </Modal>
    );
  }
}
