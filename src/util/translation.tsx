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
  CLOSE: 'Close Tab'
};

export default function translate(key: string, lan?: string): string {
  return translations[key];
}
