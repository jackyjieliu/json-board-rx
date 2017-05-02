import * as Rx from 'rxjs';
import RxBaseViewData, {Action} from '../_base/RxBaseViewData';
import BoardViewData from '../board/BoardViewData';
import * as diff from 'diff';
export interface ButtonClick {
  type: string;
}

export interface State {
  diff?: DiffObject[];
}

interface DiffButtonClick {
  idx: number;
}

export interface DiffObject {
  added?: boolean;
  count: number;
  removed?: boolean;
  value: string;
}

export default class BoardContainerViewData extends RxBaseViewData<State> {
  private diffButtonClick$: Rx.Subject<DiffButtonClick>;
  private childViewData: BoardViewData[];

  constructor(initialState: State) {
    super(initialState);
    this.diffButtonClick$ = new Rx.Subject<DiffButtonClick>();
  }

  setChildViewData( childViewData: BoardViewData[]) {
    this.childViewData = childViewData;
  }

  diffButtonClicked(idx: number) {
    this.diffButtonClick$.next({ idx });
  }

  showDiff(diff: any) {
    this.nextAction({ type: 'TOGGLE_DIFF_MODAL', value: diff });
  }

  hideDiff() {
    this.nextAction({ type: 'TOGGLE_DIFF_MODAL', value: undefined });
  }

  getDiff$() {
    return this.diffButtonClick$
      .switchMap(({idx}) => {
        const oldState$ = this.childViewData[idx].state$.take(1);
        const newState$ = this.childViewData[idx - 1].state$.take(1);

        return Rx.Observable.combineLatest(oldState$, newState$, (state1, state2) => {
          const oldText = state1.text;
          const newText = state2.text;
          return {
            oldText,
            newText
          };
        });
      })
      .map(({oldText, newText}): DiffObject[] => {
        return diff.diffLines(oldText, newText);
      });
  }

  protected reducer(state: State, action: Action) {

    switch (action.type) {
      case 'TOGGLE_DIFF_MODAL':
        state.diff = action.value;
        break;
      default:
        break;
    }
    return state;
  }
}


