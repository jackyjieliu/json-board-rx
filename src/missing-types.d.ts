declare var anyType: any;
declare module 'json-lint' {
  export = anyType;
}

declare module 'jsonminify' {
  export = anyType;
}

declare module 'diff' {
  export = anyType;
}

declare module 'react-codemirror' {
  export = anyType;
}

declare module 'js-beautify' {
  var js_beautify: any;
  export { js_beautify };
}

declare function $(el: any): any;
declare var Materialize: {
  toast: (s: string, n: number) => null;
}
