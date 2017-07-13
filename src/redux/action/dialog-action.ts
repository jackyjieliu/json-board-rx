export const ACTION = {
  OPEN_INFO: 'OPEN_INFO',
  CLOSE_INFO: 'CLOSE_INFO'
};

export function closeInfo(): Action {
  return {
    type: ACTION.CLOSE_INFO,
    payload: {}
  };
}

export function openInfo(): Action {
  return {
    type: ACTION.OPEN_INFO,
    payload: {}
  };
}
