import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
import * as Codemirror from 'react-codemirror';
import {Color} from '../settings';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/xml-fold';
import 'codemirror/addon/fold/markdown-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/display/placeholder';
import 'codemirror/mode/javascript/javascript';

// import * as CodeMirror from 'codemirror';

// New-style interface
// CodeMirror.defineExtension('foldCode', function(pos: any) {
//   var cm: any = this;
//   var doc = cm.getDoc();
//   var line = doc.getLine(pos.line); // get the line contents
//   console.log(line);
//   var pos1 = { // create a new object to avoid mutation of the original selection
//       line: pos.line,
//       ch: line.length // set the character position to the end of the line
//   };
//   doc.replaceRange('\n', pos1); // adds a new line
//   console.log(pos);
// });
// CodeMirror.on('fold', (cm: any, from: any, to: any) => {
//   console.log(cm);
//   console.log(from);
//   console.log(to);
// });
// import 'codemirror/addon/display/panel';

// import 'codemirror/addon/search/search';
// import 'codemirror/addon/search/searchcursor';
// import 'codemirror/addon/dialog/dialog';
// import 'codemirror/addon/dialog/dialog.css';

// import 'codemirror-revisedsearch';

// Diff support
// https://codemirror.net/demo/merge.html

export interface Props {
  color: Color;
  code: string;
  onCodeChange?: Function;
  onPaste?: Function;
  calculateDimension?: (el: HTMLElement) => { height: number; width: number; };
}

const options = {
  // Reference: https://codemirror.net/doc/manual.html#api
  // mode: 'javascript',
  theme: 'none',
  lineNumbers: true,
  extraKeys: null,
  // keyMap: 'basic',
  keyMap: 'default',
  foldGutter: true,
  gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
  indentationUnit: 2,
  tabSize: 2,
  viewportMargin: Infinity,
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


// var queryDialog = 'Search: <input type="text" style="width: 10em" class="CodeMirror-search-field"/>' +
// '<span style="color: #888" class="CodeMirror-search-hint">(Use /re/ syntax for regexp search)</span>' +
// '<button onclick="findtest()">Find<button>';
// function findtest(){
//   CodeMirror.commands.find = function(cm) {clearSearch(cm); doSearch(cm);};
// }

export default class FoldableTextarea extends React.Component<Props, null> {
  codeMirrorRef: any;
  codeMirror: any;
  domElem: any;
  currentHeight: number;
  currentWidth: number;
  debouncedResize: any;
  private parentEl: HTMLElement;
  private onPasteListenerFunc?: Function;

  constructor(props: any) {
    super(props);
  }

  updateCode(newCode: string) {
    if (_.isFunction(this.props.onCodeChange)) {
      this.props.onCodeChange(newCode);
    }
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
      this.codeMirror.setSize(width, height);
    }
  }

  onPasteListener(e: any) {
    if (_.isFunction(this.props.onPaste)) {
      const w: any = window;
      this.props.onPaste(e.clipboardData || w.clipboardData);
    }
  }

  componentDidMount() {
    this.domElem = ReactDOM.findDOMNode(this);
    this.codeMirror = this.codeMirrorRef.getCodeMirror();
    this.parentEl = this.domElem.parentElement;
    this.debouncedResize = _.debounce(this.updateDimension.bind(this), 100);
    window.addEventListener('resize', this.debouncedResize);
    this.updateDimension();

    if (this.props.onPaste) {
      this.onPasteListenerFunc = this.onPasteListener.bind(this);

      this.codeMirror
        .getInputField()
        .addEventListener('paste', this.onPasteListenerFunc);
    }

    // Indent Wrap https://codemirror.net/demo/indentwrap.html
    // var charWidth = this.codeMirror.defaultCharWidth(), basePadding = 4;
    // this.codeMirror.on("renderLine", (cm: any, line: any, elt: any) => {
    //   var off = countColumn(line.text, null, cm.getOption("tabSize")) * charWidth;
    //   elt.style.textIndent = "-" + off + "px";
    //   elt.style.paddingLeft = (basePadding + off) + "px";
    // });
    // this.codeMirror.refresh();

    this.codeMirror.on('fold', (cm: any, from: any, to: any) => {
      const doc = cm.getDoc();
      const pos1 = { // create a new object to avoid mutation of the original selection
          line: to.line,
          ch: to.ch //line.length // set the character position to the end of the line
      };
      doc.replaceRange('\n', pos1); // adds a new line
    });

    this.codeMirror.on('unfold', (cm: any, from: any, to: any) => {
      const doc = cm.getDoc();
      const line = doc.getLine(to.line); // get the line contents
      const trimmed:string = line.trim();
      const firstChar = (trimmed.length > 0) ? trimmed.charAt(0) : '';
      if (firstChar === '' || firstChar === '}' || firstChar === ']') {
        const pos1 = { // create a new object to avoid mutation of the original selection
            line: to.line,
            ch: 0 // set the character position to the end of the line
        };

        const pos2 = {
          line: to.line + 1,
          ch: 0
        };
        doc.replaceRange('', pos1, pos2); // adds a new line
      }
    });
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.debouncedResize);

    if (this.onPasteListenerFunc) {
      this.codeMirror
        .getInputField()
        .removeEventListener('paste', this.onPasteListenerFunc);
    }
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

