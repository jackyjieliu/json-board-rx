import * as React from 'react';
import './App.css';
import Board from './Board';
// const logo = require('./logo.svg');

const PRIMARY_COLOR = 'indigo';
// const SECONDARY_COLOR = 'cyan';
const ALERT_COLOR = 'red accent-2';

class App extends React.Component<{}, null> {
  render() {
    return (
      <div className={PRIMARY_COLOR + ' darken-1 full-column'}>
        <div className={PRIMARY_COLOR + ' top'}/>
        <div className={PRIMARY_COLOR + ' bot lighten-3'}/>

        <div className="boards-container">
          <Board/>
        </div>

        <a className={ALERT_COLOR + ' btn-floating btn-large waves-effect waves-light feedback'}>
          <i className="material-icons">add</i>
        </a>

      </div>
    );
  }
}

export default App;
