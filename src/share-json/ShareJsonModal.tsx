import * as React from 'react';
// import Modal from '../modal/Modal';
import '../modal/Modal.css';
import './ShareJsonModal.css';
import tranlsate from '../util/translation';
import { State } from '../redux/store';
import { Observable } from 'rxjs/Observable';
import { connect } from 'react-redux';
import * as ShareJsonAction from '../redux/action/share-json-action';
import { CONFIG } from '../config';
import Spinner from '../util/Spinner';
import URL from '../util/URL';
import toast from '../util/toast';

interface StateProps {
  color: Color;
  fontSize: number;
  dialogOpened: boolean;
  id: number;
  json: string;
}

interface DispatchProps {
  closeShareJson: () => void;
}

class ShareJsonModal extends React.Component<StateProps & DispatchProps,
  { urls: string[]; prevUrls: string[], loading: boolean, showAddButton: boolean }> {


  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      showAddButton: false,
      urls: [],
      prevUrls: []
    };
  }

  componentWillUpdate() {
    $('.share-json-modal .tooltipped').tooltip('remove');
  }

  componentDidUpdate(preProps: StateProps) {
    $('.share-json-modal .tooltipped').tooltip();
  }

  storeJson(json: string) {
    this.setState({
      ...this.state,
      loading: true
    });

    Observable.ajax({
      // url: 'http://localhost:3010',
      url: CONFIG.URL + '/data',
      // crossDomain: true,
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ q: json })
    })
    // Observable.ajax('http://localhost:3010', data, { 'Content-type': 'application/json' })
    .subscribe((data) => {
      const id = data.response.id;
      const url = location.host + '/' + id;

      this.setState({
        ...this.state,
        urls: [url],
        loading: false,
        showAddButton: false
      });
    }, (err) => {
      toast('An error occurred. Please try again later.');
      this.setState({
        ...this.state,
        loading: false,
        showAddButton: true
      });
    });
  }

  componentWillReceiveProps(nextProps: StateProps) {
    // Dialog is reopened or opened for the first time
    if (nextProps.dialogOpened === true &&
      this.props.dialogOpened === false) {

      let prevUrls = this.state.prevUrls;
      if (this.state.urls.length > 0) {
        prevUrls = this.state.urls;
      }

      this.setState({
        ...this.state,
        urls: [],
        prevUrls,
        showAddButton: true
      });
    }
  }

  render() {
    // const theme = this.props.color.theme;
    const backColor = 'botBack'; // (theme === 'dark') ? 'topBack' : 'botBack';
    // const fullClass = 'small';

    const openClass = (this.props.dialogOpened) ? 'open full-column' : '';

    let prevUrls;
    if (this.state.prevUrls.length > 0) {
      prevUrls = (
        <URL url={this.state.prevUrls[0]}/>
      );
    }

    if (prevUrls) {
      prevUrls = (
        <div className="last-generated-url">
          <div style={{ fontWeight: 500, marginBottom: '10px' }}>Last Generated URL</div>
          {prevUrls}
        </div>
      );
    }


    let urls;
    if (this.state.urls.length > 0) {
      urls = (
        <div className="this-generated-url">
          <div style={{ fontWeight: 500, marginBottom: '10px' }}>Short URL</div>
          <URL url={this.state.urls[0]}/>
        </div>
      );
    }

    if (urls) {
      urls = (<div className="share-json-modal-card-content">{urls}</div>);
    }

    let addButton;
    if (this.state.showAddButton) {
      addButton = (
        <div className="share-json-modal-card-content">
          <a
            className="actionBtn waves-effect waves-light btn"
            onClick={this.storeJson.bind(this, this.props.json)}
          >
            Generate short url
          </a>
          <span style={{ display: 'flex', alignItems: 'center', paddingLeft: '5px' }}>
            <i
              style={{ cursor: 'pointer' }}
              className="material-icons tooltipped topBackColor"
              data-position="right"
              data-tooltip={tranlsate('SHARE_JSON_EXPLAIN')}
            >
              help
            </i>
          </span>
        </div>
      );
    }
    return (
        <div className={backColor + ' share-json-modal ' + openClass + ' modal'} style={{width: '490px'}}>
          <Spinner show={this.state.loading} colorClass="topBack"/>

          <div className="textBack card-panel textColor">
            {urls}
            {addButton}
            {prevUrls}
          </div>
          <div className="btn-row">
            <a
              className="actionBtn waves-effect waves-light btn"
              onClick={this.props.closeShareJson.bind(this)}
            >
              Close
            </a>
          </div>
        </div>
    );
  }
}

function mapStateToProps(store: State): StateProps {
  const id = store.shareJson.id;
  const json = id !== undefined ? store.board.byId[store.shareJson.id].text : '';
  return {
    color: store.setting.color,
    fontSize: store.setting.fontSize,
    dialogOpened: store.shareJson.dialogOpened,
    json,
    id
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    closeShareJson: () => {
      dispatch(ShareJsonAction.closeShareJson());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ShareJsonModal);
