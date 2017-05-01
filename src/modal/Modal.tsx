import './Modal.css';
import * as React from 'react';
import settings, {Color} from '../settings';

interface Prop {
  color: Color;
  children?: ChildNode;
  className?: string;
  onClose: () => void;
  onSubmit?: () => void;
  submitLabel?: string;
  full: boolean;
}

export default class Modal extends React.Component<Prop, null> {

  componentDidMount() {
    settings.backdropShown();
  }

  componentWillUnmount() {
    settings.backdropHidden();
  }

  render() {
    const btnColor = this.props.color.actionBtn;
    const theme = this.props.color.theme;
    const backColor = (theme === 'dark') ? this.props.color.topBack : this.props.color.botBack;
    const submitBtn = (this.props.onSubmit) ?
      (
        <a
          className={btnColor + ' waves-effect waves-light btn'}
          style={{ marginLeft: '26px' }}
          onClick={this.props.onSubmit}
        >
          {this.props.submitLabel || 'Submit'}
        </a>
      )
      : undefined;

    const fullClass = this.props.full ? 'full' : '';

    return (
      <div className={fullClass + ' my-modal'}>
        <div className={backColor + ' modal full-column'}>
          {this.props.children}
          <div className="btn-row">
            <a className={btnColor + ' waves-effect waves-light btn'} onClick={this.props.onClose}>Close</a>
            {submitBtn}
          </div>
        </div>
        <div className="modal-overlay"/>;
      </div>
    );
  }
}