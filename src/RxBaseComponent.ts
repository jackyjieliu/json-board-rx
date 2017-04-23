import * as React from 'react';
import RxBaseViewData from './RxBaseViewData';
import * as Rx from 'rxjs';
import * as _ from 'lodash';


export abstract class RxBaseComponent<P, S, V extends RxBaseViewData<S>> extends React.Component<P, S> {
  protected viewData: V;
  private stateSub: Rx.Subscription;
  constructor(viewData: V, initialState: any, prop: any) {
    super(prop);
    this.state = _.cloneDeep(initialState);
    this.viewData = viewData;
  }

  componentDidMount() {
    this.stateSub = this.viewData.state$
      .subscribe(newState => {
        this.setState(newState);
      });
  }

  componentWillUnmount() {
    this.stateSub.unsubscribe();
  }
}


export abstract class RxBaseViewDataComponent<P, S, V extends RxBaseViewData<S>> extends RxBaseComponent<P, S, V> {
  constructor(ViewData: { new(n: S): V }, initialState: any, prop: any) {
    super(new ViewData(initialState), initialState, prop);
  }
}
