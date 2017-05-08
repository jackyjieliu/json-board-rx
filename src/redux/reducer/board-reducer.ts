import * as jsonUtil from '../../util/json-util';
import * as _ from 'lodash';
import {ACTION} from '../action/board-action';
export interface BoardState {
  byId: {
    [key: number]: {
      text: string;
      error?: string;
    }
  };
  order: number[];
}

const INITIAL_BOARD = { text: '' };

const INITIAL_STATE = {
  byId: {
    0: _.cloneDeep(INITIAL_BOARD)
  },
  order: [0]
};

function updateBoardState(state: BoardState, id: number, text: string, error?: string) {
  error = error || state.byId[id].error;
  return {
    ...state,
    byId: {
      ...state.byId,
      [id]: {
        text,
        error,
      }
    }
  };
}

export default function diffReducer(state: BoardState = INITIAL_STATE, action: Action): BoardState {
  const id = action.payload && action.payload.id;
  switch (action.type) {
    case ACTION.UPDATE_TEXT:
      return updateBoardState(state, id, action.payload.text);

    case ACTION.FORMAT_TEXT:
      const trimmedText = jsonUtil.removeNewLines(state.byId[id].text);
      const beautified = jsonUtil.beautify(trimmedText, {
        'indent_size': 2,
        'indent_char': ' ',
        'indent_with_tabs': false
      });
      const linted = jsonUtil.lint(beautified);
      return updateBoardState(state, id, linted.json, linted.error || '');

    case ACTION.MINIFY_TEXT:
      return updateBoardState(state, id, jsonUtil.minify(state.byId[id].text));

    case ACTION.UNESCAPE_TEXT:
      return updateBoardState(state, id, jsonUtil.unescape(state.byId[id].text));

    case ACTION.ESCAPE_TEXT:
      return updateBoardState(state, id, jsonUtil.escape(state.byId[id].text));

    case ACTION.DECODE_TEXT:
      return updateBoardState(state, id, jsonUtil.urlDecode(state.byId[id].text));

    case ACTION.ENCODE_TEXT:
      return updateBoardState(state, id, jsonUtil.urlEncode(state.byId[id].text));

    case ACTION.ADD_BOARD:
      if (state.order.length < Object.keys(state.byId).length) {
        return {
          ...state,
          order: state.order.concat(
            _.difference(_.range(Object.keys(state.byId).length), state.order)
          )
        };
      } else {
        const newId = state.order.length;
        return {

          byId: {
            ...state.byId,
            [newId]: _.cloneDeep(INITIAL_BOARD)
          },
          order: state.order.concat([newId])
        };
      }

    case ACTION.REMOVE_BOARD:
      return {
        ...state,
        order: _.without(state.order, id)
      };

    default:
      return state;
  }
}
