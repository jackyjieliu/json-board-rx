import {ACTION} from '../action/diff-action';

export interface DiffState {
  leftIdx: number;
  rightIdx: number;
  show: boolean;
}

const INITIAL_STATE = {
  leftIdx: 0,
  rightIdx: 0,
  show: false
};

export default function diffReducer(state: DiffState = INITIAL_STATE, action: Action): DiffState {
  switch (action.type) {
    case ACTION.SHOW_DIFF:
      return {
        leftIdx: action.payload.leftIdx,
        rightIdx: action.payload.rightIdx,
        show: true
      };
    case ACTION.HIDE_DIFF:
      return {
        leftIdx: 0,
        rightIdx: 0,
        show: false
      };
    default:
      return state;
  }
}
