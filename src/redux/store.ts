import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import boardReducer, { BoardState, boardEpic } from './reducer/board-reducer';
import feedbackReducer from './reducer/feedback-reducer';
import diffReducer, { DiffState } from './reducer/diff-reducer';
import settingReducer, { SettingState } from './reducer/setting-reducer';
import shareJsonReducer, { ShareJsonState } from './reducer/share-json-reducer';

export interface State {
  board: BoardState;
  feedback: boolean;
  setting: SettingState;
  diff: DiffState;
  shareJson: ShareJsonState;
}

const rootEpic = combineEpics(boardEpic);

const epicMiddleWare = createEpicMiddleware(rootEpic);
const middleware = applyMiddleware(epicMiddleWare);

const reducer = combineReducers<State>({
  board: boardReducer,
  feedback: feedbackReducer,
  setting: settingReducer,
  diff: diffReducer,
  shareJson: shareJsonReducer
});

export default createStore<State>(reducer, middleware);
