import * as React from 'react';
import './App.css';
import Board from './Board';
import {AVAILABLE_COLORS} from './settings';
// const logo = require('./logo.svg');
import settings, {DEFAULT_COLOR} from './settings';
import AppViewData, {State} from './AppViewData';
import RxBaseComponent from './RxBaseComponent';


const INITIAL_STATE = { color: DEFAULT_COLOR };

class App extends RxBaseComponent<null, State, AppViewData> {
  constructor(prop: any) {
    super(AppViewData, INITIAL_STATE, prop);

    settings.getColor$()
      .subscribe((color) => {
        this.viewData.nextAction({ type: 'COLOR', value: color});
      });
  }

  changeColor(i: number) {
    console.log(i, this.props);
    settings.newTheme(i);
  }

  render() {
    const lighten1 = this.state.color.lighten1;
    const lighten4 = this.state.color.lighten4;
    // const alertColor = this.props.color.alertColor;
    return (
      <div className="full-column">
        <div className={lighten1 + ' top'}/>
        <div className={lighten4 + ' bot'}/>

        <div className="boards-container">
          <Board color={this.state.color} />
        </div>

        <div className="right-bot-buttons">
          <div className="fixed-action-btn horizontal">
            <a className={lighten1 + ' btn-floating btn-large'}>C</a>
            <ul>
              {
                AVAILABLE_COLORS.map((color, i) => {
                  return (
                    <li key={color.lighten1}>
                      <a className={color.lighten1 + ' btn-floating'} onClick={this.changeColor.bind(this, i)}/>
                    </li>
                  );
                })
              }
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
/*<a className={alertColor + ' btn-floating btn-large waves-effect waves-light feedback'}>
  <i className="material-icons">add</i>
</a>*/
export default App;
