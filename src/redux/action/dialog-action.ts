export const ACTION = {
  OPEN_INFO: 'OPEN_INFO',
  CLOSE_INFO: 'CLOSE_INFO',
  OPEN_DONATION: 'OPEN_DONATION',
  CLOSE_DONATION: 'CLOSE_DONATION',
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

export function openDonation(): Action {
  return {
    type: ACTION.OPEN_DONATION,
    payload: {}
  };
}

export function closeDonation(): Action {
  return {
    type: ACTION.CLOSE_DONATION,
    payload: {}
  };
}
