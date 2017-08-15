const translations = {
  DARK: 'Dark',
  LIGHT: 'Light',
  NONE: 'None',
  VIEW: 'Viewer',
  TEXT_FIELD: 'Editor',
  SHARE_JSON: 'Share',
  SHARE_THIS_JSON: 'Share this json',
  SMART_FORMAT: 'Smart Format',
  FORMAT: 'Format',
  MINIMIZE: 'Minimize',
  UNESCAPE: 'Unescape',
  ESCAPE: 'Escape',
  URL_DECODE: 'Url Decode',
  URL_ENCODE: 'Url Encode',
  FEEDBACK: 'Feedback',
  CLOSE: 'Close Tab',
  MORE: 'More',
  LESS: 'Less',
  SHARE_JSON_EXPLAIN: 'this is a really long explaination about what share json does.' +
    'it should also talk about the expiration time and blah blah blah blah blah',
  SMART_FORMAT_EXPLAIN: 'In addition to formatting the JSON string, url decode and ' +
    'escape quoted stringified json strings'
};

export default function translate(key: string, lan?: string): string {
  return translations[key];
}
