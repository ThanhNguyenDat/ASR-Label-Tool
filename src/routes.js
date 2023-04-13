import React, { Component, lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom'
// import withAuthRequired from './hocs/withAuthRequired';
import AuthComponent from './hocs/withAuthRequired'
import LabelUILayout from './layout/LabelUILayout';

// pages
const LoginPage = lazy(() => import('./pages/login'));
const Notfound = lazy(() => import('./pages/notfound'));

// pages - label
const LabelASR = lazy(() => import('./pages/uilabel/asr'))

class WaitingComponent extends React.Component {
    renderChildren() {
        return React.Children.map(this.props.children, child => {
          return React.cloneElement(child, {
            ...this.props
          })
        })
    }

    render() {
      return (
        <React.Suspense fallback={<div className='loading'/>}>
          {this.renderChildren()}
        </React.Suspense>
      )
    } 
  }

const routes = [
    {
        path: '/',
        element: <Navigate to="/react_label_ui/ui/asr" replace/>,
        exact: true,
    },
    {
        path: '/react_label_ui',
        element: <LabelUILayout />, // Layout of react_label_ui // header default
        children: [
            {
                path: '/react_label_ui',
                element: <AuthComponent><h1>App Default</h1></AuthComponent>
            },
            {
                path: '/react_label_ui/ui/asr',
                element: <AuthComponent roles={['admin1', 'admin2']}><LabelASR /></AuthComponent>,
            },
        ]
    },
    {
        path: '/auth/login',
        element: <WaitingComponent><LoginPage /></WaitingComponent>,
    },
    { 
        path: '*', 
        element: <WaitingComponent><Notfound /></WaitingComponent> 
    },
]

export default routes;