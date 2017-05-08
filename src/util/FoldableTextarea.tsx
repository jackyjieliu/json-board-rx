import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
import * as Codemirror from 'react-codemirror';
import {Color} from '../settings';
import * as resizeDetectorMaker from 'element-resize-detector';
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

  // From the react-dimensions decorator
  containerWidth?: number;
  containerHeight?: number;
}

const options = {
  // Reference: https://codemirror.net/doc/manual.html#api
  mode: 'javascript',
  lineNumbers: true,
  extraKeys: null,
  // keyMap: 'basic',
  keyMap: 'default',
  foldGutter: true,
  gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
  indentationUnit: 2,
  tabSize: 2,
  indentWithTabs: true,
  placeholder: '',
  smartIndent: false, // Set to false since json indentation is weird
  lineWrapping: true, // Wrap instead of scroll when line is too long
};

// Indent Wrap https://codemirror.net/demo/indentwrap.html
// function countColumn(string: any, end: any, tabSize: any, startIndex?: any, startValue?: any) {
//   if (end == null) {
//     end = string.search(/[^\s\u00a0]/)
//     if (end == -1) { end = string.length }
//   }
//   for (var i = startIndex || 0, n = startValue || 0;;) {
//     var nextTab = string.indexOf("\t", i)
//     if (nextTab < 0 || nextTab >= end)
//       { return n + (end - i) }
//     n += nextTab - i
//     n += tabSize - (n % tabSize)
//     i = nextTab + 1
//   }
// }

export default class FoldableTextarea extends React.Component<Props, null> {
  codeMirrorRef: any;
  codeMirror: any;
  domElem: any;
  currentHeight: number;
  currentWidth: number;
  debouncedResize: any;
  private resizeDetector: any;
  private parentEl: HTMLElement;

  constructor(props: any) {
    super(props);
    this.resizeDetector = resizeDetectorMaker();
  }


  updateCode(newCode: string) {
    if (_.isFunction(this.props.onCodeChange)) {
      this.props.onCodeChange(newCode);
    }
  }

  componentDidMount() {
    this.domElem = ReactDOM.findDOMNode(this);
    this.codeMirror = this.codeMirrorRef.getCodeMirror();
    // this.debouncedResize = _.debounce(this.updateDimension.bind(this), 100);
    // window.addEventListener('resize', this.debouncedResize);
    // this.updateDimension();

    this.parentEl = this.domElem.parentElement;
    this.resizeDetector.listenTo(this.parentEl, (element: HTMLElement) => {
      var width = element.offsetWidth;
      var height = element.offsetHeight;

      if (this.currentHeight !== height || this.currentWidth !== width) {
        this.currentHeight = height;
        this.currentWidth = width;
        this.codeMirror.setSize(width, height);
      }
    });

    this.currentWidth = this.parentEl.offsetWidth;
    this.currentHeight = this.parentEl.offsetHeight;
    this.codeMirror.setSize(this.currentWidth, this.currentHeight);

    // Indent Wrap https://codemirror.net/demo/indentwrap.html
    // var charWidth = this.codeMirror.defaultCharWidth(), basePadding = 4;
    // this.codeMirror.on("renderLine", (cm: any, line: any, elt: any) => {
    //   var off = countColumn(line.text, null, cm.getOption("tabSize")) * charWidth;
    //   elt.style.textIndent = "-" + off + "px";
    //   elt.style.paddingLeft = (basePadding + off) + "px";
    // });
    // this.codeMirror.refresh();

  }

  // componentDidUpdate() {
  //   this.updateDimension();
  // }

  componentWillUnmount () {
    // window.removeEventListener('resize', this.debouncedResize);

    this.resizeDetector.removeAllListeners(this.parentEl);
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

