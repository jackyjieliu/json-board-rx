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
  SHARE_JSON_EXPLAIN: 'Generate a link that you can share you JSON with. Data maybe deleted after 24 hours. ' +
    'Please refrain from storing sensitive information like password or secret keys as anyone with the link will be ' +
    'able to access the data',
  SMART_FORMAT_EXPLAIN: 'In addition to formatting the JSON string, url decode and ' +
    'escape quoted stringified json strings'
};

export default function translate(key: string, lan?: string): string {
  return translations[key];
}
