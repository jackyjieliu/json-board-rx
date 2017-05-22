import './BoardContainer.css';
import * as React from 'react';
import Board from '../board/Board';
import { State } from '../redux/store';
import { connect } from 'react-redux';
import * as DiffAction from '../redux/action/diff-action';

interface StateProps {
  color: Color;
  fontSize: number;
  boardOrder: number[];
  backdrop: boolean;
}

interface DispatchProps {
  showDiff: (left: number, right: number) => void;
}


class BoardContainer extends React.Component<StateProps & DispatchProps, {}> {

  componentDidMount() {
    $('.board textarea').last().focus();
  }

  componentWillUpdate() {
    $('.tooltipped').tooltip('remove');
  }

  componentDidUpdate() {
    if (this.props.backdrop) {
      $('.board textarea').attr('tabindex', -1);
    } else {
      $('.board textarea').attr('tabindex', 0);
    }
    $('.tooltipped').tooltip();
  }

  render() {
    const actionBtn = this.props.color.actionBtn;
    /*let modal;
    if (this.state.diff) {
      modal = (
        <DiffModal
          fontSize={this.props.fontSize}
          color={this.props.color}
          onClose={this.hideDiff.bind(this)}
          diffObject={this.state.diff}
        />
      );
    }*/

    return (
      <div className="boards-container" >
        {
          this.props.boardOrder
            .map((i) => {
              let diffButton;

              if (i !== 0) {
                diffButton = (
                  <a
                    className={actionBtn + ' btn-floating btn-large waves-effect waves-light diff-button'}
                    onClick={this.props.showDiff.bind(this, i - 1, i)}
                  >
                    <i className="material-icons">compare_arrows</i>
                  </a>
                );
              }

              return (
                <div className="board-wrapper" key={i}>
                  <Board
                    index={i}
                  />
                  {diffButton}
                </div>
              );
            })
        }
        {/*{modal}*/}
{/*
          <a className="waves-effect waves-light btn" href="#modal1">Modal</a>

          <div id="modal1" className="modal">
            <div className="modal-content">
              <h4>Modal Header</h4>
              <p>A bunch of text</p>
            </div>
            <div className="modal-footer">
              <a href="#!" className="modal-action modal-close waves-effect waves-green btn-flat">Agree</a>
            </div>
          </div>*/}

      </div>
    );
  }
}

function mapStateToProps(store: State): StateProps {
  return {
    color: store.setting.color,
    fontSize: store.setting.fontSize,
    boardOrder: store.board.order,
    backdrop: store.feedback
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    showDiff: (left: number, right: number) => {
      dispatch(DiffAction.showDiff(left, right));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BoardContainer);


