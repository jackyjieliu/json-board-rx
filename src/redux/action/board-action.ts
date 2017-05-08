
export const ACTION = {
  UPDATE_TEXT: 'UPDATE_TEXT',
  FORMAT_TEXT: 'FORMAT_TEXT',
  MINIFY_TEXT: 'MINIFY_TEXT',
  UNESCAPE_TEXT: 'UNESCAPE_TEXT',
  ESCAPE_TEXT: 'ESCAPE_TEXT',
  DECODE_TEXT: 'DECODE_TEXT',
  ENCODE_TEXT: 'ENCODE_TEXT',
  ADD_BOARD: 'ADD_BOARD',
  REMOVE_BOARD: 'REMOVE_BOARD'
};

export function updateTextAction(id: number, text: string): Action {
  return {
    type: ACTION.UPDATE_TEXT,
    payload: { id, text }
  };
}

export function formatAction(id: number): Action {
  return {
    type: ACTION.FORMAT_TEXT,
    payload: { id }
  };
}

export function minifyAction(id: number): Action {
  return {
    type: ACTION.MINIFY_TEXT,
    payload: { id }
  };
}

export function unescapeAction(id: number): Action {
  return {
    type: ACTION.UNESCAPE_TEXT,
    payload: { id }
  };
}

export function escapeAction(id: number): Action {
  return {
    type: ACTION.ESCAPE_TEXT,
    payload: { id }
  };
}

export function decodeAction(id: number): Action {
  return {
    type: ACTION.DECODE_TEXT,
    payload: { id }
  };
}

export function encodeAction(id: number): Action {
  return {
    type: ACTION.ENCODE_TEXT,
    payload: { id }
  };
}

export function addBoard(): Action {
  return {
    type: ACTION.ADD_BOARD,
    payload: {}
  };
}

export function removeBoard(id: number): Action {
  return {
    type: ACTION.REMOVE_BOARD,
    payload: { id }
  };
}
