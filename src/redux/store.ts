import { createStore, combineReducers } from 'redux';
import boardReducer, { BoardState } from './reducer/board-reducer';
import feedbackReducer from './reducer/feedback-reducer';
import settingReducer, { SettingState } from './reducer/setting-reducer';

export interface State {
  board: BoardState;
  feedback: boolean;
  setting: SettingState;
}

const reducer = combineReducers<State>({
  board: boardReducer,
  feedback: feedbackReducer,
  setting: settingReducer
});

export default createStore<State>(reducer);
