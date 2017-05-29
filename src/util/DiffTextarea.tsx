import * as React from 'react';
import Textarea from './Textarea';
import CodemirrorMerge from './react-codemirror-merge';
// window['diff-match-path']  = require('diff-match-patch');
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/merge/merge.css';
import 'codemirror/addon/merge/merge';

interface Props {
  leftText: string;
  rightText: string;
  calculateDimension?: Function;
}

const options = {
  // Reference: https://codemirror.net/doc/manual.html#api
  // mode: 'javascript',
  theme: 'none',
  lineNumbers: true,
  extraKeys: null,
  // keyMap: 'basic',
  keyMap: 'default',
  // foldGutter: true,
  // gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
  gutters: ['CodeMirror-linenumbers'],
  indentationUnit: 2,
  tabSize: 2,
  // viewportMargin: Infinity,
  indentWithTabs: true,
  placeholder: '',
  smartIndent: false, // Set to false since json indentation is weird
  lineWrapping: true, // Wrap instead of scroll when line is too long

  // Disable editing for now
  allowEditingOriginals: false,
  readOnly: true,

  connect: 'align'
};




// function mergeViewHeight(mergeView: any) {
//     function editorHeight(editor: any) {
//       if (!editor) {
//         return 0;
//       }
//       return editor.getScrollInfo().height;
//     }

//     return Math.max(editorHeight(mergeView.leftOriginal()),
//                     editorHeight(mergeView.editor()),
//                     editorHeight(mergeView.rightOriginal()));
//   }


// function resize(mergeView: any) {
//   var height = mergeViewHeight(mergeView);
//   for ( ; ; ) {
//     if (mergeView.leftOriginal()) {
//       mergeView.leftOriginal().setSize(null, height);
//     }
//     mergeView.editor().setSize(null, height);

//     if (mergeView.rightOriginal()) {
//       mergeView.rightOriginal().setSize(null, height);
//     }

//     var newHeight = mergeViewHeight(mergeView);
//     if (newHeight >= height) {
//       break;
//     } else {
//       height = newHeight;
//     }
//   }
//   mergeView.wrap.style.height = height + 'px';
// }


function setHeight(mergeView: any, height: number) {
  if (mergeView.leftOriginal()) {
    mergeView.leftOriginal().setSize(null, height);
  }
  mergeView.editor().setSize(null, height);

  if (mergeView.rightOriginal()) {
    mergeView.rightOriginal().setSize(null, height);
  }

  mergeView.wrap.style.height = height + 'px';
}

export default class DiffTextarea extends Textarea<Props, null> {
  codeMirrorRef: any;

  getCodeMirror() {
    // return undefined;
    return this.codeMirrorRef.getCodeMirror().editor();
  }


  updateDimension() {
    // super.updateDimension()
    if (this.props.calculateDimension) {

      const { height } = this.props.calculateDimension(this.parentEl);
      setHeight(this.codeMirrorRef.getCodeMirror(), height);
    }
    // resize(this.codeMirrorRef.getCodeMirror());
  }

  render() {
    // Reference: https://github.com/JedWatson/react-codemirror
    let style: any = {};
    if (this.props.fontSize) {
      style.fontSize = this.props.fontSize + 'px';
    }
    return (
      <div className="full-column" style={style}>
        <CodemirrorMerge
          ref={(el: any) => { this.codeMirrorRef = this.codeMirrorRef || el; }}
          className="full-column"
          options={options}
          leftText={this.props.leftText}
          rightText={this.props.rightText}
        />
      </div>
    );
  }
}
