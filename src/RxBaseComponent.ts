import * as React from 'react';
import RxBaseViewData from './RxBaseViewData';
import * as Rx from 'rxjs';


export interface RxBaseViewDataConstructor<S> {
  new(n: S): RxBaseViewData<S>;
}

abstract class RxBaseComponent<P, S, V extends RxBaseViewData<S>> extends React.Component<P, S> {
  protected viewData: V;
  private stateSub: Rx.Subscription;
  constructor(ViewData: { new(n: S): V }, initialState: any, prop: any) {
    super(prop);
    this.state = initialState;
    this.viewData = new ViewData(initialState);
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

export default RxBaseComponent;
