import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';

abstract class Textarea<P, S> extends React.Component<P & { calculateDimension?: Function }, S> {
  protected parentEl: any;
  protected currentHeight: number;
  protected currentWidth: number;
  protected codeMirror: any;
  protected domElem: any;
  protected debouncedResize: EventListenerObject;

  abstract getCodeMirror(): any;
  updateDimension() {
    if (!this.codeMirror) {
      return;
    }
    let width;
    let height;
    if (_.isFunction(this.props.calculateDimension)) {
      const dim = this.props.calculateDimension(this.parentEl);
      width = dim.width;
      height = dim.height;
    } else {
      width = this.parentEl.offsetWidth;
      height = this.parentEl.offsetHeight;
    }

    if (this.currentHeight === undefined || this.currentWidth === undefined ||
      this.currentHeight !== height || this.currentWidth !== width) {

      this.currentHeight = height;
      this.currentWidth = width;
      this.codeMirror.setSize(width, height);
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.debouncedResize);
  }


  componentDidMount() {
    this.domElem = ReactDOM.findDOMNode(this);
    this.codeMirror = this.getCodeMirror();
    this.parentEl = this.domElem.parentElement;
    this.debouncedResize = _.debounce(this.updateDimension.bind(this), 100);
    window.addEventListener('resize', this.debouncedResize);
    this.updateDimension();
  }
}

export default Textarea;
