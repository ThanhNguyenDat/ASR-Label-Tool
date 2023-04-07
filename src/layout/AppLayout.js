import React, { Component } from 'react';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';

import TopNav from '../containers/navs/Topnav';
import Sidebar from '../containers/navs/Sidebar';

@connect(state => ({
  containerClassnames: state.menu.containerClassnames,
}))
export default class AppLayout extends Component {
  render() {
    const { containerClassnames } = this.props;
    return (
      <div id="app-container" className={containerClassnames}>
        <TopNav history={this.props.history} {...this.props} />
        <Sidebar {...this.props} />
        <main>
          <div className="container-fluid">{renderRoutes(this.props.route.routes)}</div>
        </main>
      </div>
    );
  }
}
