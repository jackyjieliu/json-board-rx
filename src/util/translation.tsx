const translations = {
  DARK: 'Dark',
  LIGHT: 'Light',
  NONE: 'None',
  SHARE_JSON: 'Share This JSON',
  SMART_FORMAT: 'Smart Format',
  FORMAT: 'Format',
  MINIMIZE: 'Minimize',
  UNESCAPE: 'Unescape',
  ESCAPE: 'Escape',
  URL_DECODE: 'Url Decode',
  URL_ENCODE: 'Url Encode',
  FEEDBACK: 'Feedback',
  CLOSE: 'Close Tab',
  SHARE_JSON_EXPLAIN: 'this is a really long explaination about what share json does.' +
    'it should also talk about the expiration time and blah blah blah blah blah'
};

export default function translate(key: string, lan?: string): string {
  return translations[key];
}
