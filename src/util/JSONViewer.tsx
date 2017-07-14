import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
import './JSONViewer.css';

export interface Props {
  json: any;
  fontSize?: number;
  color?: Color;
  calculateDimension: Function;
}

export default class JSONViwer extends React.Component<Props, null> {
  protected parentEl: any;
  protected currentHeight: number;
  protected currentWidth: number;
  protected codeMirror: any;
  protected domElem: any;
  protected debouncedResize: EventListenerObject;
  private id: number;

  constructor(props: any) {
    super(props);
  }
  componentWillMount() {
    this.id = Math.floor(Math.random() * 10000000);
  }


  updateDimension() {
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
      }

      this.domElem.style.width = this.currentWidth + 'px';
      this.domElem.style.height = this.currentHeight + 'px';
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.debouncedResize);
  }

  componentDidMount() {
    $('#json-viewer-' + this.id).jsonBrowse(this.props.json, { collapsed: true });

    this.domElem = ReactDOM.findDOMNode(this);
    this.parentEl = this.domElem.parentElement;
    this.debouncedResize = _.debounce(this.updateDimension.bind(this), 100);
    window.addEventListener('resize', this.debouncedResize);
    this.updateDimension();
  }

  render() {
    const style: any = { padding: '10px 20px', margin: '0' };
    if (this.props.fontSize) {
      style.fontSize = this.props.fontSize + 'px';
    }
    return (
      <div className="full-column json-viewer word-wrap">
        <pre id={'json-viewer-' + this.id} style={style}/>
      </div>
    );
  }
}

