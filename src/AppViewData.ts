import RxBaseViewData, {Action} from './RxBaseViewData';
import {Color} from './settings';

export interface State {
  color: Color;
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
      default:
        break;
    }
    return state;
  }
}

