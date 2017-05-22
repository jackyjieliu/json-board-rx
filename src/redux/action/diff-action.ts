
export const ACTION = {
  SHOW_DIFF: 'SHOW_DIFF',
  HIDE_DIFF: 'HIDE_DIFF'
};

export function showDiff(leftIdx: number, rightIdx: number): Action {
  return {
    type: ACTION.SHOW_DIFF,
    payload: {
      leftIdx, rightIdx
    }
  };
}

export function hideDiff(): Action {
  return {
    type: ACTION.HIDE_DIFF,
    payload: {}
  };
}
