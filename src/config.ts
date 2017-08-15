export const MODE = {
  DEV: 'dev',
  PROD: 'prod'
};

// const M = MODE.DEV;
const M = MODE.PROD;
const AVAILABLE = ['INFO'];

let config = {
  URL: 'https://json-board.herokuapp.com',
  MODE: MODE.PROD,
  FEATURE: {
    INFO: false,
    SHARE: false
  }
};

if (M === MODE.DEV) {
  config = {
    URL: 'http://localhost:5000',
    MODE: MODE.DEV,
    FEATURE: {
      INFO: true,
      SHARE: true
    }
  };
}

AVAILABLE.forEach((feature) => {
  if (config.FEATURE[feature] === false) {
    config.FEATURE[feature] = true;
  }
});

export const CONFIG = config;
