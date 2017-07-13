export const MODE = {
  DEV: 'dev',
  PROD: 'prod'
};

// const M = MODE.DEV;
const M = MODE.PROD;

let config = {
  URL: 'https://json-board.herokuapp.com',
  MODE: MODE.PROD
};

if (M === MODE.DEV) {
  config = {
    URL: 'http://localhost:5000',
    MODE: MODE.DEV
  };
}

export const CONFIG = config;
