import * as React from 'react';
// import Modal from '../modal/Modal';
import '../modal/Modal.css';
import translate from '../util/translation';
import { State } from '../redux/store';
import { connect } from 'react-redux';
import * as SettingAction from '../redux/action/setting-action';
import { AVAILABLE_COLORS } from '../redux/reducer/setting-reducer';

interface StateProps {
  color: Color;
  fontSize: number;
  settingDialogOpened: boolean;
  onPasteAction: string;
}

interface DispatchProps {
  closeSetting: () => void;
  openSetting: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  changeTheme: (i: number) => void;
  changeOnPaste: (option: string) => void;
  setToDefault: (i: number) => void;
}

class SettingModal extends React.Component<StateProps & DispatchProps, {}> {

  settings() {
    const a = {
      display: 'flex',
      'flexGrow': 1,
      'align-items': 'center',
      marginBottom: '20px'
    };
    const b = {
      marginBottom: '20px'
    };
    const pad = {
      padding: '0 10px',
      marginRight: '5px'
    };
    return (
      <div
        style={{
          display: 'flex',
          'justifyContent': 'center'
        }}
      >
        {/*TITLE*/}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            paddingRight: '30px'
          }}
        >
          <div style={a}>Theme:</div>
          <div style={a}>Font Size:</div>
          <div style={a}>On Paste:</div>
        </div>

        {/*OPTIONS*/}
        <div>
          {/*Theme*/}
          <div style={b}>
            {
              AVAILABLE_COLORS.map((color, i) => {
                let className = 'waves-effect waves-light btn';
                const isSelected = this.props.color.name === color.name;
                if (isSelected) {
                  className += ' actionBtn';
                } else {
                  className += ' secondBtn';
                }
                return (
                  <span className="theme-picker" key={i}>
                    <a
                      style={pad}
                      className={className}
                      key={i}
                      onClick={this.props.changeTheme.bind(this, i)}
                    >
                      {translate(color.theme.toUpperCase())}
                    </a>
                  </span>
                );
              })
            }
          </div>
          {/*Font Size*/}
          <div style={b}>
            <a
              style={pad}
              className="actionBtn waves-effect waves-light btn"
              onClick={this.props.decreaseFontSize.bind(this)}
            >
              <i className="material-icons">remove</i>
            </a>
            <a
             style={pad}
             className="actionBtn waves-effect waves-light btn"
             onClick={this.props.increaseFontSize.bind(this)}
            >
              <i className="material-icons">add</i>
            </a>
          </div>

          {/*On Paste*/}
          <div style={b}>
            {
              ['SMART_FORMAT', 'FORMAT', 'NONE'].map((option) => {
                const isSelected = option === this.props.onPasteAction;
                let className = 'waves-effect waves-light btn';
                if (isSelected) {
                  className += ' actionBtn';
                } else {
                  className += ' secondBtn';
                }
                return (
                  <a
                    style={pad}
                    className={className}
                    key={option}
                    onClick={this.props.changeOnPaste.bind(this, option)}
                  >
                    {translate(option)}
                  </a>
                );
              })
            }

          </div>
        </div>
      </div>
    );

  }

  render() {
    // const theme = this.props.color.theme;
    const backColor = 'botBack'; // (theme === 'dark') ? 'topBack' : 'botBack';
    // const fullClass = 'small';

    const openClass = (this.props.settingDialogOpened) ? 'open full-column' : '';


    return (
        <div className={backColor + ' ' + ' ' + openClass + ' modal'} style={{width: '480px'}}>
          <div className="textBack card-panel textColor">
            {this.settings()}
          </div>
          <div className="btn-row">
            <a
              className="actionBtn waves-effect waves-light btn"
              onClick={this.props.setToDefault.bind(this)}
              style={{ marginRight: '5px' }}
            >
              Default
            </a>
            <a
              className="actionBtn waves-effect waves-light btn"
              onClick={this.props.closeSetting.bind(this)}
            >
              Close
            </a>
          </div>
        </div>
    );
  }
}


function mapStateToProps(store: State): StateProps {
  return {
    color: store.setting.color,
    fontSize: store.setting.fontSize,
    onPasteAction: store.setting.onPasteAction,
    settingDialogOpened: store.setting.settingDialogOpened
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    closeSetting: () => {
      dispatch(SettingAction.closeSetting());
    },
    openSetting: () => {
      dispatch(SettingAction.openSetting());
    },
    increaseFontSize: () => {
      dispatch(SettingAction.increaseFontSize());
    },
    decreaseFontSize: () => {
      dispatch(SettingAction.decreaseFontSize());
    },
    changeTheme: (i: number) => {
      dispatch(SettingAction.changeTheme(i));
    },
    setToDefault: () => {
      dispatch(SettingAction.setToDefault());
    },
    changeOnPaste: (option: string) => {
      dispatch(SettingAction.changeOnPasteSmartFormat(option));
    }
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(SettingModal);

