import './BoardContainer.css';
import * as React from 'react';
import * as Rx from 'rxjs';
import * as _ from 'lodash';

import BoardContainerViewData, {State} from './BoardContainerViewData';

import Board, {INITIAL_BOARD_STATE} from '../board/Board';
import BoardViewData from '../board/BoardViewData';
import DiffModal from '../diff/DiffModal';
import {Color} from '../settings';
import {RxBaseViewDataComponent} from '../_base/RxBaseComponent';

interface Prop {
  color: Color; fontSize: number; boardCount: number;
}

export default class BoardContainer extends RxBaseViewDataComponent<Prop, State, BoardContainerViewData> {
  private subscriptions: Rx.Subscription[];
  private childViewData: BoardViewData[];

  constructor(props: any) {
    super(BoardContainerViewData, { diffOpened: false }, props);
    this.subscriptions = [];
    this.childViewData = [];
    this.viewData.setChildViewData(this.childViewData);
    _.range(this.props.boardCount).forEach((i) => {
      this.childViewData.push(new BoardViewData(INITIAL_BOARD_STATE));
    });

    this.viewData.getDiff$()
      .subscribe((diff) => {
        console.log(diff);
        this.viewData.showDiff(diff);
      });

  }

  diffButtonClicked(i: number) {
    // Show diff between i and i - 1
    this.viewData.diffButtonClicked(i);
  }

  componentDidMount() {
    $('.board textarea').last().focus();
  }

  componentWillReceiveProps(nextProps: Prop) {
    if (nextProps.boardCount > this.props.boardCount) {
      _.range(nextProps.boardCount - this.childViewData.length)
        .map(() => {
          this.childViewData.push(new BoardViewData(INITIAL_BOARD_STATE));
        });
    }
  }

  hideDiff() {
    this.viewData.hideDiff();
  }

  render() {
    const actionBtn = this.props.color.actionBtn;
    let modal;
    if (this.state.diff) {
      modal = (
        <DiffModal
          fontSize={this.props.fontSize}
          color={this.props.color}
          onClose={this.hideDiff.bind(this)}
          diffObject={this.state.diff}
        />
      );
    }

    return (
      <div className="boards-container" >
        {
          _.range(this.props.boardCount)
            .map((i) => {
              let diffButton;
              if (i !== 0) {
                diffButton = (
                  <a
                    className={actionBtn + ' btn-floating btn-large waves-effect waves-light diff-button'}
                    onClick={this.diffButtonClicked.bind(this, i)}
                  >
                    <i className="material-icons">compare_arrows</i>
                  </a>
                );
              }

              return (
                <div className="board-wrapper" key={i}>
                  <Board
                    color={this.props.color}
                    viewData={this.childViewData[i]}
                    fontSize={this.props.fontSize}
                  />
                  {diffButton}
                </div>
              );
            })
        }
        {modal}
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

