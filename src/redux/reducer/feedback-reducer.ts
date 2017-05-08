
import { ACTION } from '../action/feedback-action';


export default function feedbackReducer(state: boolean = false, action: Action): boolean {
  switch (action.type) {
    case ACTION.SHOW_FEEDBACK:
      return true;
    case ACTION.HIDE_FEEDBACK:
      return false;
    default:
      return state;
  }
}
