import * as React from 'react';
// import Modal from '../modal/Modal';
import '../modal/Modal.css';
import { State } from '../redux/store';
import { connect } from 'react-redux';
import * as SettingAction from '../redux/action/setting-action';
import { AVAILABLE_COLORS } from '../redux/reducer/setting-reducer';

interface StateProps {
  color: Color;
  fontSize: number;
  settingDialogOpened: boolean;
}

interface DispatchProps {
  closeSetting: () => void;
  openSetting: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  changeTheme: (i: number) => void;
  setToDefault: (i: number) => void;
}

class SettingModal extends React.Component<StateProps & DispatchProps, {}> {

  settings() {
    const a = {
      display: 'flex',
      'flexGrow': 1,
      'align-items': 'center',
      marginBottom: '10px'
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            paddingRight: '30px'
          }}
        >
          <div style={a}>Theme:</div>
          <div style={a}>Font Size:</div>
        </div>
        <div>
          <div style={{marginBottom: '10px'}}>
            {
              AVAILABLE_COLORS.map((color, i) => {
                if (this.props.color.name === color.name) {
                  return (
                    <span className="selected-theme" key={i}>
                      <a
                        className="botBack waves-effect waves-light btn"
                        style={{
                          marginRight: '3px',
                          borderRadius: '20px',
                          padding: '20px'
                        }}
                      />
                    </span>
                  );
                }
                return (
                  <span id={color.name} className="theme-picker" key={i}>
                    <a
                      className="botBack waves-effect waves-light btn"
                      onClick={this.props.changeTheme.bind(this, i)}
                      style={{
                        marginRight: '3px',
                        borderRadius: '20px',
                        padding: '20px'
                      }}
                    />
                  </span>
                );
              })
            }
          </div>
          <div style={{marginBottom: '10px'}}>
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
        </div>
      </div>
    );

    /*return (
      <div>
        <div style={{ display: 'flex' }}>
          <div>Theme:</div>
          <div>Font Size: {this.props.fontSize}</div>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex' }}>

            {
              AVAILABLE_COLORS.map((color, i) => {
                if (this.props.color.name === color.name) {
                  return (
                    <span className="selected-theme">
                      <a className="botBack waves-effect waves-light btn" />
                    </span>
                  );
                }
                return (
                  <span id={color.name} className="theme-picker">
                    <a
                      className="botBack waves-effect waves-light btn"
                      onClick={this.props.changeTheme.bind(this, i)}
                    />
                  </span>
                );
              })
            }
          </div>
          <div>
            <a className="actionBtn waves-effect waves-light btn" onClick={this.props.decreaseFontSize.bind(this)}>
              <i className="material-icons">remove</i>
            </a>
            <a className="actionBtn waves-effect waves-light btn" onClick={this.props.increaseFontSize.bind(this)} >
              <i className="material-icons">add</i>
            </a>
          </div>
        </div>
      </div>
    );*/
  }

  render() {
    // const theme = this.props.color.theme;
    const backColor = 'botBack'; // (theme === 'dark') ? 'topBack' : 'botBack';
    // const fullClass = 'small';

    const openClass = (this.props.settingDialogOpened) ? 'open full-column' : '';


    return (
        <div className={backColor + ' ' + ' ' + openClass + ' modal'} style={{width: '450px'}}>
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
    }
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(SettingModal);

