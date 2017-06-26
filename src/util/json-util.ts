import { js_beautify as jsBeautify } from 'js-beautify';
import * as jsonlint from 'json-lint';

export function lint(str: string): {
  json: string;
  error?: string;
  evidence?: string;
} {
  return jsonlint(str);
}

export function beautify(str: string, conf?: any): string {

  return jsBeautify(str, conf || {
    'indent_size': 2,
    'indent_char': ' ',
    'indent_with_tabs': false
  });
}

export function minify(str: string): string {
  return minifyLib(str);
}

export function removeNewLines(str: string) {
  return (str).replace(/\r?\n|\r/g, '');
}

export function escape (str: string) {
  return ('' + str).replace(/["'\\\n\r\u2028\u2029]/g, (character: string) => {
    switch (character) {
      case '"':
      case '\'':
      case '\\':
        return '\\' + character;
      case '\n':
        return '\\n';
      case '\r':
        return '\\r';
      case '\u2028':
        return '\\u2028';
      case '\u2029':
        return '\\u2029';
      default:
        return '';
    }
  });
}

export function unescape (str: string) {
  return ('' + str).replace(/\\./g, (character: string) => {
    switch (character) {
      case '\\"':
        return '"';
      case '\\\'':
        return '\'';
      case '\\\\':
        return '\\';
      case '\\n':
        return '\n';
      case '\\r':
        return '\r';
      case '\\u2028':
        return '\u2028';
      case '\\u2029':
        return '\u2029';
      default:
        return '';
    }
  });
}

export  function urlEncode(str: string) {
  return encodeURIComponent(str).replace(/'/g, '%27').replace(/"/g, '%22');
}

export  function urlDecode(str: string) {
  return decodeURIComponent(str.replace(/\+/g,  ' '));
}

function minifyLib (json: string): string {
  return json.replace(/\s+(?=((\\[\\"]|[^\\"])*"(\\[\\"]|[^\\"])*")*(\\[\\"]|[^\\"])*$)/g, '');
  // return json.replace(/([^"]+)|("[^"]+")/g, function($0, $1, $2) {
  //   if ($1) {
  //       return $1.replace(/\s/g, '');
  //   } else {
  //       return $2;
  //   }
  // });
};

