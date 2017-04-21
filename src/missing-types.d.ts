declare var anyType: any;
declare module 'json-lint' {
  export = anyType;
}

declare module 'jsonminify' {
  export = anyType;
}

declare module 'js-beautify' {
  var js_beautify: any;
  export { js_beautify };
}