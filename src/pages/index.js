import React from 'react';
import { renderRoutes } from 'react-router-config';
import { ReactNotifications } from 'react-notifications-component';

const IndexPage = props => (
  <>
    <ReactNotifications />
    {renderRoutes(props.route.routes)}
  </>
);

export default IndexPage;
