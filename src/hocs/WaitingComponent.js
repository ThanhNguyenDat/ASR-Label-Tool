import React, { Component, Fragment } from 'react';

export default class WaitingComponent extends Component {
    constructor(props) {
      super(props);
      this.ComponentChild = ComponentChild
    }

    render() {
      return (
        <Suspense fallback={<div className="loading" />}>
          <ComponentChild {...props} />  
        </Suspense>
      );
    }
     
}