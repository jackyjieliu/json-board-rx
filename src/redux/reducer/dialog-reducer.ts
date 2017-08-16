import { ACTION } from '../action/dialog-action';

let INITIAL_STATE: any = {
  donationDialogOpened: false,
  infoDialogOpened: false
};

export interface DialogState {
  donationDialogOpened: boolean;
  infoDialogOpened: boolean;
}

export default function dialogReducer(state: DialogState = INITIAL_STATE, action: Action): DialogState {
  let newState = state;
  switch (action.type) {
    case ACTION.OPEN_INFO:
      newState = {
        ...state,
        infoDialogOpened: true
      };
      break;
    case ACTION.CLOSE_INFO:
      newState = {
        ...state,
        infoDialogOpened: false
      };
      break;
    case ACTION.OPEN_DONATION:
      newState = {
        ...state,
        donationDialogOpened: true
      };
      break;
    case ACTION.CLOSE_DONATION:
      newState = {
        ...state,
        donationDialogOpened: false
      };
      break;
    default:
  }

  return newState;
}
