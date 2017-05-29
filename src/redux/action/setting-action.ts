
export const ACTION = {
  SET_TO_DEFAULT: 'SET_TO_DEFAULT',
  CHANGE_THEME: 'CHANGE_THEME',
  INCREMENT_FONT_SIZE: 'INCREMENT_FONT_SIZE',
  DECREMENT_FONT_SIZE: 'DECREMENT_FONT_SIZE',
  CLOSE_SETTINGS: 'CLOSE_SETTINGS',
  OPEN_SETTINGS: 'OPEN_SETTINGS'
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

export function closeSetting(): Action {
  return {
    type: ACTION.CLOSE_SETTINGS,
    payload: {}
  };
}

export function openSetting(): Action {
  return {
    type: ACTION.OPEN_SETTINGS,
    payload: {}
  };
}

export function setToDefault(): Action {
  return {
    type: ACTION.SET_TO_DEFAULT,
    payload: {}
  }
}