
export const ACTION = {
  OPEN_SHARE_JSON: 'OPEN_SHARE_JSON',
  CLOSE_SHARE_JSON: 'CLOSE_SHARE_JSON'
};

export function openShareJson(id: number): Action  {
  return {
    type: ACTION.OPEN_SHARE_JSON,
    payload: { id }
  };
}

export function closeShareJson(): Action  {
  return {
    type: ACTION.CLOSE_SHARE_JSON,
    payload: {}
  };
}
