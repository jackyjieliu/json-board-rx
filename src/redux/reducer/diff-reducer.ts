


export default function diffReducer(state: boolean = false, action: Action): boolean {
  switch (action.type) {
    case 'SHOW_DIFF':
      return true;
    case 'HIDE_DIFF':
      return false;
    default:
      return state;
  }
}
