import { ACTION } from '../action/share-json-action';

let INITIAL_STATE: any = {
  dialogOpened: false,
  id: undefined
};

export interface ShareJsonState {
  dialogOpened: boolean;
  id: number;
}

export default function settingReducer(state: ShareJsonState = INITIAL_STATE, action: Action): ShareJsonState {
  let newState = state;
  switch (action.type) {
    case ACTION.OPEN_SHARE_JSON:
      newState = {
        ...state,
        dialogOpened: true,
        id: action.payload.id
      };
      break;
    case ACTION.CLOSE_SHARE_JSON:
      newState = {
        ...state,
        dialogOpened: false,
        id: undefined
      };
      break;
    default:
  }

  return newState;
}
