import * as jsonUtil from './json-util';


function shouldUnescape(text: string) {
  const shouldUnescape = text.search(/[{\[]\s*\\".*[}\]]/g) !== -1;
  return shouldUnescape;
}

function shouldDecode(text: string) {
  return text.indexOf('%22') !== -1 ||
    text.indexOf('%7B') !== -1 ||
    text.indexOf('%25') !== -1;
}


function findMatchAfter(reg: string, text: string, i: number, includeEnd: boolean) {
  let regObj = new RegExp(reg, 'g');
  let match = regObj.exec(text);
  let foundIdx: number | undefined = undefined;

  while (match) {
    foundIdx = match.index;
    if (foundIdx > i) {
      if (includeEnd) {
        foundIdx += match[0].length - 1;
      }
      break;
    }
    match = regObj.exec(text);
  }

  if (foundIdx !== undefined && foundIdx < i) {
    foundIdx = undefined;
  }
  return foundIdx;
}

function findQuotedStr(text: string, i: number) {

  // Look for "{\"
  let begin = findMatchAfter('"\s*[{]\s*\\\\"', text, i, false);
  let end = undefined;

  if (begin !== undefined) {
    end = findMatchAfter('[}]\s*"', text, begin, true);
    if (end === undefined) {
      begin = undefined;
      end = undefined;
    }
  }

  if (begin === undefined) {
    // Look for "[\"
    begin = findMatchAfter('"\s*[\[]]\s*\\\\"', text, i, false);

    if (begin !== undefined) {
      end = findMatchAfter('[\]]\s*"', text, begin, true);
      if (end === undefined) {
        begin = undefined;
        end = undefined;
      }
    }
  }

  return { begin, end };
}

function removeQuote(text: string, i: number): string {
  const len = text.length;
  if (i >= len) {
    return text;
  }

  // Remove " that surrounds escaped quotes

  // console.log(i, text);
  if (text.indexOf('\\"', i) > 0) {
    const { begin, end } = findQuotedStr(text, i);
    // console.log({ begin, end }, text);
    if (begin !== undefined && end !== undefined) {
      // Remove the " in front of the escaped quote
      text = text.slice(0, begin) + text.slice(begin + 1, end) + text.slice(end + 1);

      return removeQuote(text, begin);
    }
  }
  return text;
}

function unescape(text: string) {
  const quoteRemoved = removeQuote(text, 0);

  // console.log(text);
  return { json: jsonUtil.unescape(quoteRemoved), altered: quoteRemoved.length !== text.length };
}

function decode(text: string) {
  return { json: jsonUtil.urlDecode(text), altered: true };
}

function doFormat(text: string) {

  let actionsPerformed = false;
  if (shouldUnescape(text)) {
    // console.log('unescaped');
    const unescaped = unescape(text);
    text = unescaped.json;
    actionsPerformed = actionsPerformed || unescaped.altered;
  }

  if (shouldDecode(text)) {
    // console.log('decode');
    const decoded = decode(text);
    text = decoded.json;
    actionsPerformed = actionsPerformed || decoded.altered;
  }

  if (actionsPerformed) {
    text = doFormat(text);
  }

  return text;
}

export function smartFormat(text: string) {
  const formatted = doFormat(jsonUtil.removeNewLines(text));
  // console.log(formatted);
  const trimmedText = jsonUtil.removeNewLines(formatted);
  const beautified = jsonUtil.beautify(trimmedText);
  const linted = jsonUtil.lint(beautified);
  return linted;
}