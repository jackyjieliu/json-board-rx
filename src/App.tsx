import * as React from 'react';
import './App.css';
import Board from './Board';
import {AVAILABLE_COLORS} from './settings';
// const logo = require('./logo.svg');
import settings, {DEFAULT_COLOR, DEFAULT_FONT_SIZE} from './settings';
import AppViewData, {State} from './AppViewData';
import {RxBaseViewDataComponent} from './RxBaseComponent';
import * as _ from 'lodash';


const INITIAL_STATE = { color: DEFAULT_COLOR, fontSize: DEFAULT_FONT_SIZE , boards: 1};

class App extends RxBaseViewDataComponent<null, State, AppViewData> {
  constructor(prop: any) {
    super(AppViewData, INITIAL_STATE, prop);

    settings.getColor$()
      .subscribe((color) => {
        this.viewData.nextAction({ type: 'COLOR', value: color});
      });
    settings.getFontSize$()
      .subscribe((fontSize) => {
        this.viewData.nextAction({ type: 'FONT_SIZE', value: fontSize});
      });
  }

  changeColor(i: number) {
    settings.newTheme(i);
  }

  changeFont(font: number) {
    if (font < 36 && font > 6) {
      settings.setFontSize(font);
    }
  }

  setBoardCount(count: number) {
    this.viewData.nextAction({ type: 'BOARDS', value: count});
  }

  render() {
    const disp = this.state.color.disp;
    const fontButton = this.state.color.disp;
    const topBack = this.state.color.topBack;
    const botBack = this.state.color.botBack;
    // const alertColor = this.props.color.alertColor;

    let addBoardButton = (

      <a
        className={fontButton + ' btn-floating btn-large waves-effect waves-light'}
        onClick={this.setBoardCount.bind(this, this.state.boards + 1)}
      >
        <i className="material-icons">add</i>
      </a>
    );
    if (this.state.boards === 2) {
      addBoardButton = (
        <a
          className={fontButton + ' btn-floating btn-large waves-effect waves-light'}
          onClick={this.setBoardCount.bind(this, this.state.boards - 1)}
        >
          <i className="material-icons">remove</i>
        </a>
      );
    }

    return (
      <div className="full-column">
        <div className={topBack + ' top'}/>
        <div className={botBack + ' bot'}/>

        <div className="boards-container" >
          {
            _.range(this.state.boards).map((i) => {
              console.log(i);
              return (
                <Board color={this.state.color} fontSize={this.state.fontSize} idx={i} key={i}/>
              );
            })
          }
        </div>
        <div className="right-bot-buttons">

          {
            addBoardButton
          }
          <div className="fixed-action-btn horizontal">
            <a className={fontButton + ' btn-floating btn-large'}>
              <i className="material-icons">format_size</i>
            </a>
            <ul>
              <li>
                <a
                  className={fontButton + ' btn-floating'}
                  onClick={this.changeFont.bind(this, this.state.fontSize + 2)}
                >
                  <i className="material-icons">add</i>
                </a>
              </li>
              <li>
                <a
                  className={fontButton + ' btn-floating'}
                  onClick={this.changeFont.bind(this, this.state.fontSize - 2)}
                >
                  <i className="material-icons">remove</i>
                </a>
              </li>
            </ul>
          </div>
          <div className="fixed-action-btn horizontal">
            <a className={disp + ' btn-floating btn-large'}>
              <i className="material-icons">lens</i>
            </a>
            <ul>
              {
                AVAILABLE_COLORS.map((color, i) => {
                  return (
                    <li key={color.disp}>
                      <a className={color.disp + ' btn-floating'} onClick={this.changeColor.bind(this, i)}/>
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

export default App;
