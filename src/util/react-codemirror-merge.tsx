import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
const findDOMNode = ReactDOM.findDOMNode;
const className = require('classnames');
const debounce = require('lodash.debounce');
// function normalizeLineEndings(str: string) {
//   if (!str) {
//     return str;
//   }
//   return str.replace(/\r\n|\r/g, '\n');
// }

interface Prop {
  className?: any;
  codeMirrorInstance?: any;
  defaultValue?: string;
  onChange?: Function;
  onFocusChange?: Function;
  onScroll?: Function;
  options?: any;
  // path?: string;

  leftText: string;
  rightText: string;
  // value?: string;
  preserveScrollPosition?: boolean;
}

export default class CodeMirrorMerge extends React.Component<Prop, { isFocused: boolean }> {
  static defaultProps = {
    preserveScrollPosition: false,
  };
  codeMirror: any;
  targetEle: any;
  constructor(props: any) {
    super(props);
    this.state =  {
      isFocused: false,
    };
  }
  getCodeMirrorInstance() {
    return this.props.codeMirrorInstance || require('codemirror');
  }
  componentWillMount() {
    this.componentWillReceiveProps = debounce(this.componentWillReceiveProps, 0);
  }
  componentDidMount() {
    const targetEleNode = findDOMNode(this.targetEle);
    const codeMirrorInstance = this.getCodeMirrorInstance();

    const options = _.assign({
      value: this.props.leftText,
      orig: this.props.rightText
    }, this.props.options);
    this.codeMirror = codeMirrorInstance.MergeView(targetEleNode, options);
    // TODO: no "on"
    // this.codeMirror.on('change', this.codemirrorValueChanged.bind(this));
    // this.codeMirror.on('focus', this.focusChanged.bind(this, true));
    // this.codeMirror.on('blur', this.focusChanged.bind(this, false));
    // this.codeMirror.on('scroll', this.scrollChanged.bind(this));

    // this.codeMirror.setValue(this.props.defaultValue || this.props.value || '');
  }
  componentWillUnmount() {
    // is there a lighter-weight way to remove the cm instance?
    if (this.codeMirror) {
      // TODO: fix:
      // this.codeMirror.toTextArea();
    }
  }
  componentWillReceiveProps(nextProps: Prop) {
    // if (this.codeMirror && nextProps.value !== undefined &&
    //   normalizeLineEndings(this.codeMirror.getValue()) !== normalizeLineEndings(nextProps.value)) {

    //   if (this.props.preserveScrollPosition) {
    //     var prevScrollPosition = this.codeMirror.getScrollInfo();
    //     this.codeMirror.setValue(nextProps.value);
    //     this.codeMirror.scrollTo(prevScrollPosition.left, prevScrollPosition.top);
    //   } else {
    //     this.codeMirror.setValue(nextProps.value);
    //   }
    // }
    if (typeof nextProps.options === 'object') {
      for (let optionName in nextProps.options) {
        if (nextProps.options.hasOwnProperty(optionName)) {
          this.codeMirror.setOption(optionName, nextProps.options[optionName]);
        }
      }
    }
  }
  getCodeMirror() {
    return this.codeMirror;
  }
  focus() {
    if (this.codeMirror) {
      this.codeMirror.focus();
    }
  }
  focusChanged(focused: any) {
    this.setState({
      isFocused: focused,
    });
    if (this.props.onFocusChange) {
      this.props.onFocusChange(focused);
    }
  }
  scrollChanged(cm: any) {
    if (this.props.onScroll) {
      this.props.onScroll(cm.getScrollInfo());
    }
  }
  codemirrorValueChanged(doc: any, change: any) {
    if (this.props.onChange && change.origin !== 'setValue') {
      this.props.onChange(doc.getValue(), change);
    }
  }
  render() {
    const editorClassName = className(
      'ReactCodeMirror',
      this.state.isFocused ? 'ReactCodeMirror--focused' : null,
      this.props.className
    );
    return (
      <div className={editorClassName}>
        <div
                  ref={(el: any) => { this.targetEle = this.targetEle || el; }}
        />
                  {/*name={this.props.path}*/}
                  {/*autoComplete="off"*/}
                  {/*defaultValue={this.props.value}*/}
      </div>
    );
  }
}
