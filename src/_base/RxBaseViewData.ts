import * as Rx from 'rxjs';
import * as _ from 'lodash';

export interface Action {
  type: string;
  value?: any;
}

abstract class RxBaseViewData<S> {
  public state$: Rx.Observable<S>;
  private action$: Rx.Subject<Action>;

  constructor(initialState: S) {
    this.action$ = new Rx.BehaviorSubject({type: ''});
    this.state$ = this.setupState(initialState);
  }

  nextAction(arg: any) {
    this.action$.next(arg);
  }

  protected abstract reducer(state: S, action: Action): S;

  private setupState(initialState: S) {
    return this.action$
      .scan((state, action) => {
        return this.reducer(_.cloneDeep(state), action);
      }, initialState);
  }
}

export default RxBaseViewData;
