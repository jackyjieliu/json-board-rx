const translations = {
  FORMAT: 'Format',
  MINIMIZE: 'Minimize',
  UNESCAPE: 'Unescape',
  ESCAPE: 'Escape',
  URL_DECODE: 'Url Decode',
  URL_ENCODE: 'Url Encode'
};

export default function translate(key: string, lan?: string): string {
  return translations[key];
}
