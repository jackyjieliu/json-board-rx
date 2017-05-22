import * as React from 'react';
import Textarea from './Textarea';
import * as _ from 'lodash';
import * as Codemirror from 'react-codemirror';
// import Codemirror from './react-codemirror-merge';
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
import 'codemirror/addon/display/panel';

import 'codemirror/addon/search/search';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/dialog/dialog.css';
import './codemirror-search';
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
  // viewportMargin: Infinity,
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

export default class FoldableTextarea extends Textarea<Props, null> {
  codeMirrorRef: any;
  private onPasteListenerFunc?: Function;

  constructor(props: any) {
    super(props);
  }

  getCodeMirror() {
    return this.codeMirrorRef.getCodeMirror();
  }

  updateCode(newCode: string) {
    if (_.isFunction(this.props.onCodeChange)) {
      this.props.onCodeChange(newCode);
    }
  }

  onPasteListener(e: any) {
    if (_.isFunction(this.props.onPaste)) {
      const w: any = window;
      this.props.onPaste(e.clipboardData || w.clipboardData);
    }
  }

  componentDidMount() {
    super.componentDidMount();

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

    this.codeMirror.on('fold', this.onFold);
    this.codeMirror.on('unfold', this.onUnfold);
  }

  onFold(cm: any, from: any, to: any) {
    // console.log('Fold', { from, to });
    const doc = cm.getDoc();
    const line = doc.getLine(from.line); // get the line contents
    const spacesNeeded = line.search(/\S|$/);
    const replaceLine = '\n' + _.range(spacesNeeded).map(() => {
      return ' ';
    }).join('');

    const pos1 = { // create a new object to avoid mutation of the original selection
        line: to.line,
        ch: to.ch //line.length // set the character position to the end of the line
    };
    doc.replaceRange(replaceLine, pos1); // adds a new line
  }

  onUnfold(cm: any, from: any, to: any) {
    // console.log('Unfold', { from, to });
    const doc = cm.getDoc();
    const line = doc.getLine(to.line); // get the line contents
    const pos1 = { // create a new object to avoid mutation of the original selection
        line: to.line,
        ch: _.trimEnd(line).length // set the character position to the end of the line
    };
    const pos2 = {
      line: to.line + 1,
      ch: 0
    };
    doc.replaceRange('', pos1, pos2); // adds a new line
    // }
  }

  componentWillUnmount () {
    super.componentWillUnmount();

    if (this.onPasteListenerFunc) {
      this.codeMirror
        .getInputField()
        .removeEventListener('paste', this.onPasteListenerFunc);
    }

    if (_.isFunction(this.codeMirror.closeFind)) {
      this.codeMirror.closeFind();
    }

    this.codeMirror.off('fold');
    this.codeMirror.off('unfold');
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

