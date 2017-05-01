import RxBaseViewData, {Action} from '../_base/RxBaseViewData';

export interface State {
  feedback: string;
  email: string;
}
export default class FeedbackModalViewModal extends RxBaseViewData<State> {

  protected reducer(state: State, action: Action) {

    switch (action.type) {
      case 'FEEDBACK':
        state.feedback = action.value;
        break;
      case 'EMAIL':
        state.email = action.value;
        break;
      default:
        break;
    }
    return state;
  }
}