import * as React from 'react';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import toast from '../util/toast';

interface Props {
  url: string;
}
const Copy: any = CopyToClipboard;

export default class URL extends React.Component<Props, null> {

  copied(text: string, result: boolean) {
    if (result) {
      toast('URL Copied');
    } else {
      toast('Failed to copy text');
    }
  }

  render() {
    return (
      <div>
        <span
          style={{
            position: 'relative',
            top: '1px'
          }}
        >
          {this.props.url}
        </span>
        <Copy
          text={this.props.url}
          onCopy={this.copied.bind(this)}
        >
          <a className="secondBtn btn waves-effect waves-light" style={{ padding: '0 10px', marginLeft: '5px' }}>
            <i className="material-icons">content_copy</i>
          </a>
        </Copy>
      </div>
    );
  }
}
