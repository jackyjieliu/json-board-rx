/// <reference path="./missing-types.d.ts" />

import './lib/diff-match-patch';
// import 'materialize-css/dist/js/materialize.js';
// import 'materialize-css/dist/css/materialize.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './app/App';
import './index.css';
import './theme/theme.css';
import 'json-browse/json-browse/jquery.json-browse.css';
import 'json-browse/json-browse/jquery.json-browse.js';

import { Provider } from 'react-redux';
import store from './redux/store';

ReactDOM.render(
  (
    <Provider store={store}>
      <App />
    </Provider>
  ),
  document.getElementById('root') as HTMLElement
);
