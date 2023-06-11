import React from 'react';
import {Layout, LayoutProps} from 'react-admin';
import Menu from './Menu';

export default (props) => (
    <Layout {...props} menu={Menu} />
)