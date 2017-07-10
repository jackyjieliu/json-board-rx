declare var anyType: any;
declare module 'json-lint' {
  export = anyType;
}

declare module 'react-copy-to-clipboard' {
  export = anyType;
}

declare module 'jsonminify' {
  export = anyType;
}

declare module 'diff' {
  export = anyType;
}

declare module 'codemirror' {
  export = anyType;
}

declare module 'react-codemirror' {
  export = anyType;
}

declare module 'js-beautify' {
  var js_beautify: any;
  export { js_beautify };
}

declare module 'element-resize-detector' {
  export = anyType
}

declare module 'query-string' {
  export = anyType
}

declare function $(el: any): any;
declare var Materialize: {
  toast: (s: string, n: number) => null;
}



type Dispatch = (a: Action) => void;

interface Action {
  type: string;
  payload: any;
}

interface Color {
  // actionBtn: string;
  // disp: string;
  // topBack: string;
  // botBack: string;
  // textBack: string;
  // error: string;
  // textColor: string;
  name: string;
  theme: string;
}