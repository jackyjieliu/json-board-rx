/// <reference path="./missing-types.d.ts" />

import 'materialize-css/dist/js/materialize.js';
import 'materialize-css/dist/css/materialize.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
