import './BoardContainer.css';
import * as React from 'react';
import Board from '../board/Board';
import { State } from '../redux/store';
import { connect } from 'react-redux';
import * as DiffAction from '../redux/action/diff-action';

interface StateProps {
  color: Color;
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

  // componentWillUpdate() {
  //   $('.tooltipped').tooltip('remove');
  // }

  componentDidUpdate() {
    if (this.props.backdrop) {
      $('.board textarea').attr('tabindex', -1);
    } else {
      $('.board textarea').attr('tabindex', 0);
    }
    // $('.tooltipped').tooltip();
  }

  render() {

    return (
      <div className="boards-container" >
        {
          this.props.boardOrder
            .map((i, index, arr) => {
              let diffButton;

              if (index !== 0) {
                diffButton = (
                  <a
                    className="actionBtn btn-floating btn-large waves-effect waves-light diff-button"
                    onClick={this.props.showDiff.bind(this, arr[index - 1], i)}
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
      </div>
    );
  }
}

function mapStateToProps(store: State): StateProps {
  return {
    color: store.setting.color,
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


