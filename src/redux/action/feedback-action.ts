
export const ACTION = {
  SHOW_FEEDBACK: 'SHOW_FEEDBACK',
  HIDE_FEEDBACK: 'HIDE_FEEDBACK'
};

export function showFeedback(): Action {
  return {
    type: ACTION.SHOW_FEEDBACK,
    payload: {}
  };
}

export function hideFeedback(): Action {
  return {
    type: ACTION.HIDE_FEEDBACK,
    payload: {}
  };
}
