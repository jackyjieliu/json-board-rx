import * as _ from 'lodash';
import { ACTION } from '../action/setting-action';

export const AVAILABLE_COLORS = [{
  actionBtn: 'grey darken-2',
  disp: 'grey lighten-2',
  topBack: 'grey',
  botBack: 'grey lighten-1',
  textBack: 'grey lighten-3',
  error: 'pink lighten-5',
  textColor: '#000',
  theme: 'light'
}];

const DEFAULT_FONT_SIZE = 16;

export interface SettingState {
  color: Color;
  fontSize: number;
}

const INITIAL_STATE = {
  color: _.cloneDeep(AVAILABLE_COLORS[0]),
  fontSize: DEFAULT_FONT_SIZE
};

const MAX_FONT_SIZE = 36;
const MIN_FONT_SIZE = 6;
const FONT_STEP = 2;

export default function settingReducer(state: SettingState = INITIAL_STATE, action: Action): SettingState {
  switch (action.type) {
    case ACTION.CHANGE_THEME:
      return {
        ...state,
        color: AVAILABLE_COLORS[action.payload.id]
      };
    case ACTION.INCREMENT_FONT_SIZE:
      const incrementedSize = state.fontSize + FONT_STEP;
      return {
        ...state,
        fontSize: (incrementedSize > MAX_FONT_SIZE) ? state.fontSize : incrementedSize
      };
    case ACTION.DECREMENT_FONT_SIZE:
      const decrementedSize = state.fontSize - FONT_STEP;
      return {
        ...state,
        fontSize: (decrementedSize < MIN_FONT_SIZE) ? state.fontSize : decrementedSize
      };
    default:
      return state;
  }
}
