
export const ACTION = {
  CHANGE_THEME: 'CHANGE_THEME',
  INCREMENT_FONT_SIZE: 'INCREMENT_FONT_SIZE',
  DECREMENT_FONT_SIZE: 'DECREMENT_FONT_SIZE'
};

export function changeTheme(id: number): Action {
  return {
    type: ACTION.CHANGE_THEME,
    payload: {
      id
    }
  };
}

export function increaseFontSize(): Action {
  return {
    type: ACTION.INCREMENT_FONT_SIZE,
    payload: {}
  };
}

export function decreaseFontSize(): Action {
  return {
    type: ACTION.DECREMENT_FONT_SIZE,
    payload: {}
  };
}
