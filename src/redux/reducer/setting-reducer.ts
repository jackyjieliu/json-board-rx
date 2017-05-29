import * as _ from 'lodash';
import { ACTION } from '../action/setting-action';

export const AVAILABLE_COLORS = [{
    name: 'grey-theme',
    theme: 'light'
  }, {
    name: 'dark-theme',
    theme: 'dark'
  }];

const DEFAULT_FONT_SIZE = 16;

export interface SettingState {
  color: Color;
  fontSize: number;
  settingDialogOpened: boolean;
}

const DEFAULT_STATE = {
  color: _.cloneDeep(AVAILABLE_COLORS[0]),
  fontSize: DEFAULT_FONT_SIZE,
  settingDialogOpened: false
};

let initState: any = {};
try {
  const storedSetting = localStorage.getItem('jsonparse');
  if (storedSetting) {
    initState = JSON.parse(storedSetting);
    delete initState.settingDialogOpened;
  }
} catch (e) {
  initState = {};
}

const INITIAL_STATE = _.defaults(initState, _.cloneDeep(DEFAULT_STATE));

const MAX_FONT_SIZE = 36;
const MIN_FONT_SIZE = 6;
const FONT_STEP = 2;

export default function settingReducer(state: SettingState = INITIAL_STATE, action: Action): SettingState {
  let newState = state;
  switch (action.type) {
    case ACTION.CHANGE_THEME:
      newState = {
        ...state,
        color: _.cloneDeep(AVAILABLE_COLORS[action.payload.id])
      };
      break;
    case ACTION.INCREMENT_FONT_SIZE:
      const incrementedSize = state.fontSize + FONT_STEP;
      newState = {
        ...state,
        fontSize: (incrementedSize > MAX_FONT_SIZE) ? state.fontSize : incrementedSize
      };
      break;
    case ACTION.DECREMENT_FONT_SIZE:
      const decrementedSize = state.fontSize - FONT_STEP;
      newState = {
        ...state,
        fontSize: (decrementedSize < MIN_FONT_SIZE) ? state.fontSize : decrementedSize
      };
      break;
    case ACTION.CLOSE_SETTINGS:
      newState = {
        ...state,
        settingDialogOpened: false
      };
      break;
    case ACTION.OPEN_SETTINGS:
      newState = {
        ...state,
        settingDialogOpened: true
      };
      break;
    case ACTION.SET_TO_DEFAULT:
      newState = _.cloneDeep(DEFAULT_STATE);
      newState.settingDialogOpened = state.settingDialogOpened;
      break;
    default:
  }

  if (newState !== state) {
    try {
      localStorage.setItem('jsonparse', JSON.stringify(newState));
    } catch (e) {
      ;
    }
  }

  return newState;
}
