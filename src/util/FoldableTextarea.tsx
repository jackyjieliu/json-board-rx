import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
import * as Codemirror from 'react-codemirror';
import {Color} from '../settings';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/xml-fold';
import 'codemirror/addon/fold/markdown-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/display/placeholder';
// Diff support
// https://codemirror.net/demo/merge.html

export interface Props {
  color: Color;
  code: string;
  onCodeChange?: Function;
  heightCalculation?: Function;

  // From the react-dimensions decorator
  containerWidth?: number;
  containerHeight?: number;
}

const options = {
  // Reference: https://codemirror.net/doc/manual.html#api
  mode: 'javascript',
  lineNumbers: true,
  extraKeys: {'Ctrl-Q': function(cm: any){ cm.foldCode(cm.getCursor()); }},
  foldGutter: true,
  gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
  indentationUnit: 2,
  tabSize: 2,
  indentWithTabs: true,
  placeholder: '',
  smartIndent: false, // Set to false since json indentation is weird
  lineWrapping: true, // Wrap instead of scroll when line is too long
};

export default class FoldableTextarea extends React.Component<Props, null> {
  codeMirrorRef: any;
  codeMirror: any;
  domElem: Element;
  currentHeight: number;
  debouncedResize: any;

  updateCode(newCode: string) {
    if (_.isFunction(this.props.onCodeChange)) {
      this.props.onCodeChange(newCode);
    }
  }

  setCodeMirrorScrollerHeight(codeMirror: any, height: number) {
    this.currentHeight = height;
    codeMirror.display.scroller.style.height = height + 'px';
    codeMirror.display.wrapper.style.height = height + 'px';
  }

  // Set height of scrollable component otherwise the div will keep expanding
  updateDimension() {
    let newHeight;
    if (_.isFunction(this.props.heightCalculation)) {
      newHeight = this.props.heightCalculation(this.domElem);
    } else {
      newHeight = this.domElem.clientHeight;
    }
    if (newHeight !== this.currentHeight) {
      this.setCodeMirrorScrollerHeight(this.codeMirror, newHeight);
    }
  }

  componentDidMount() {
    this.domElem = ReactDOM.findDOMNode(this);
    this.codeMirror = this.codeMirrorRef.getCodeMirror();
    this.debouncedResize = _.debounce(this.updateDimension.bind(this), 100);
    window.addEventListener('resize', this.debouncedResize);
    this.updateDimension();
  }

  // componentDidUpdate() {
  //   this.updateDimension();
  // }

  componentWillUnmount () {
    window.removeEventListener('resize', this.debouncedResize);
  }

  render() {
    // Reference: https://github.com/JedWatson/react-codemirror
    return (
      <Codemirror
        className="full-column"
        ref={(el: any) => { this.codeMirrorRef = this.codeMirrorRef || el; }}
        value={this.props.code}
        onChange={this.updateCode.bind(this)}
        options={options}
      />
    );
  }
}
