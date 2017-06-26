import * as jsonUtil from '../../util/json-util';
import { smartFormat } from '../../util/smart-format';
import * as _ from 'lodash';
import {ACTION} from '../action/board-action';
import { combineEpics, Epic } from 'redux-observable';
import 'rxjs';

export interface BoardState {
  byId: {
    [key: number]: {
      text: string;
      error?: string;
      spinner: boolean
    }
  };
  order: number[];
}

let initText = '';
// const initText = '{"asd":{"asd":true}}';

const INITIAL_BOARD = { text: initText, spinner: false };

const INITIAL_STATE = {
  byId: {
    0: _.cloneDeep(INITIAL_BOARD)
  },
  order: [0]
};

function updateBoardState(state: BoardState, id: number, text: string, error?: string) {
  error = _.isString(error) ? error : state.byId[id].error;
  return {
    ...state,
    byId: {
      ...state.byId,
      [id]: {
        spinner: false,
        text,
        error,
      }
    }
  };
}

function format(text: string) {
  const trimmedText = jsonUtil.removeNewLines(text);
  const beautified = jsonUtil.beautify(trimmedText);
  const linted = jsonUtil.lint(beautified);
  return linted;
}

export default function diffReducer(state: BoardState = INITIAL_STATE, action: Action): BoardState {
  const id = action.payload && action.payload.id;
  switch (action.type) {
    case ACTION.UPDATE_TEXT:
      return updateBoardState(state, id, action.payload.text);
    case ACTION.INIT_STRING:
      return updateBoardState(state, id, action.payload.text);

    case ACTION.URL_DECODE_AND_FORMAT:
      const decodeAndlinted = format(jsonUtil.urlDecode(state.byId[id].text));
      return updateBoardState(state, id, decodeAndlinted.json, decodeAndlinted.error || '');

    case ACTION.SMART_FORMAT:
      const smartFormatted = smartFormat(state.byId[id].text);
      return updateBoardState(state, id, smartFormatted.json, smartFormatted.error || '');

    case ACTION.FORMAT_TEXT:

      const linted = format(state.byId[id].text);
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

    case ACTION.SHOW_SPINNER:
      return {
        ...state,
        byId: {
          ...state.byId,
          [id]: {
            ...state.byId[id],
            spinner: true
          }
        }
      };

    default:
      return state;
  }
}

const loadingEpic: Epic<Action, any> = (action$) =>
  action$
    .ofType(ACTION.SHOW_SPINNER)
    .delay(0)
    .map(({ payload }) => {
      return payload.nextAction;
    });

const initStringEpic: Epic<Action, any> = (action$) =>
  action$
    .ofType(ACTION.INIT_STRING)
    .delay(0)
    .map(({ payload }) => {
      console.log('pay', payload);
      return {
        type: ACTION.SHOW_SPINNER,
        payload: {
          id: payload.id,
          nextAction: {
            type: ACTION.URL_DECODE_AND_FORMAT,
            payload: { id: payload.id }
          }
        }
      };
    });

export const boardEpic = combineEpics(loadingEpic, initStringEpic);
