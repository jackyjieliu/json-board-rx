
export const ACTION = {
  SMART_FORMAT: 'SMART_FORMAT',
  UPDATE_TEXT: 'UPDATE_TEXT',
  FORMAT_TEXT: 'FORMAT_TEXT',
  MINIFY_TEXT: 'MINIFY_TEXT',
  UNESCAPE_TEXT: 'UNESCAPE_TEXT',
  ESCAPE_TEXT: 'ESCAPE_TEXT',
  DECODE_TEXT: 'DECODE_TEXT',
  ENCODE_TEXT: 'ENCODE_TEXT',
  ADD_BOARD: 'ADD_BOARD',
  REMOVE_BOARD: 'REMOVE_BOARD',
  SHOW_SPINNER: 'SHOW_SPINNER',
  INIT_STRING: 'INIT_STRING',
  URL_DECODE_AND_FORMAT: 'URL_DECODE_AND_FORMAT'
};

export const ASYNC_ACTIONS = [
  ACTION.FORMAT_TEXT,
  ACTION.MINIFY_TEXT,
  ACTION.UNESCAPE_TEXT,
  ACTION.ESCAPE_TEXT,
  ACTION.DECODE_TEXT,
  ACTION.ENCODE_TEXT,
];

function packageAsyncAction(action: Action): Action {
  const isAsync = ASYNC_ACTIONS.indexOf(action.type) > -1;

  if (isAsync) {
    return {
      type: ACTION.SHOW_SPINNER,
      payload: {
        id: action.payload.id,
        nextAction: action
      }
    };
  }
  return action;
}

export function smartFormatAction(id: number): Action {
  return packageAsyncAction({
    type: ACTION.SMART_FORMAT,
    payload: { id }
  });
}

export function updateTextAction(id: number, text: string): Action {
  return packageAsyncAction({
    type: ACTION.UPDATE_TEXT,
    payload: { id, text }
  });
}

export function formatAction(id: number): Action {
  return packageAsyncAction({
    type: ACTION.FORMAT_TEXT,
    payload: { id }
  });
}

export function minifyAction(id: number): Action {
  return packageAsyncAction({
    type: ACTION.MINIFY_TEXT,
    payload: { id }
  });
}

export function unescapeAction(id: number): Action {
  return packageAsyncAction({
    type: ACTION.UNESCAPE_TEXT,
    payload: { id }
  });
}

export function escapeAction(id: number): Action {
  return packageAsyncAction({
    type: ACTION.ESCAPE_TEXT,
    payload: { id }
  });
}

export function decodeAction(id: number): Action {
  return packageAsyncAction({
    type: ACTION.DECODE_TEXT,
    payload: { id }
  });
}

export function encodeAction(id: number): Action {
  return packageAsyncAction({
    type: ACTION.ENCODE_TEXT,
    payload: { id }
  });
}

export function addBoard(): Action {
  return packageAsyncAction({
    type: ACTION.ADD_BOARD,
    payload: {}
  });
}

export function removeBoard(id: number): Action {
  return packageAsyncAction({
    type: ACTION.REMOVE_BOARD,
    payload: { id }
  });
}

export function initString(text: string): Action {
  return packageAsyncAction({
    type: ACTION.INIT_STRING,
    payload: { id: 0, text }
  });
}

