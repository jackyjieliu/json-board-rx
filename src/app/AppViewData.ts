import RxBaseViewData, {Action} from '../_base/RxBaseViewData';
import {Color} from '../settings';

export interface State {
  color: Color;
  fontSize: number;
  boards: number;
  backdrop: boolean;
  feedback: boolean;
}

export default class AppViewData extends RxBaseViewData<State> {

  constructor(initialState: State) {
    super(initialState);
  }

  protected reducer(state: State, action: Action) {
    switch (action.type) {
      case 'COLOR':
        state.color = action.value;
        break;
      case 'FONT_SIZE':
        state.fontSize = action.value;
        break;
      case 'BOARDS':
        state.boards = action.value;
        break;
      case 'BACKDROP':
        state.backdrop = action.value;
        break;
      case 'FEEDBACK':
        state.feedback = action.value;
        break;
      default:
        break;
    }
    return state;
  }
}

