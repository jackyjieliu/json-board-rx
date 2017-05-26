import * as React from 'react';
import './Spinner.css';

export default class Spinner extends React.Component<{ show: boolean; colorClass: string; }, {}> {
  render() {
    const style = this.props.show ? {} : { display : 'none'};
    return (
      <div className="spinner-wrapper" style={style}>
        <div className="preloader-wrapper big active">
          <div className={this.props.colorClass + '-spinner spinner-layer'}>
            <div className="circle-clipper left">
              <div className="circle"/>
            </div><div className="gap-patch">
              <div className="circle"/>
            </div><div className="circle-clipper right">
              <div className="circle"/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}