import React, { Component, lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom'
// import withAuthRequired from './hocs/withAuthRequired';
import AuthComponent from './hocs/withAuthRequired'
import LabelUILayout from './layouts/LabelUILayout';
import FaceIDLayout from './layouts/FaceIDLayout';
import TestTextEditor from './pages/uitest/testTextEditor';
import FaceIDDetail from './pages/faceid/FaceIDDetail';

// import LoginPage from './pages/login'
// import Notfound from './pages/notfound'
// import LabelASR from './pages/uilabel/asr'
// // FaceID
// import FaceIDMember from './pages/faceid/FaceIDMember'


// pages
const LoginPage = lazy(() => import('./pages/login'));
const Notfound = lazy(() => import('./pages/notfound'));

// label pages
const LabelASR = lazy(() => import('./pages/uilabel/asr'))

// faceid pages
const FaceIDMember = lazy(() => import('./pages/faceid/FaceIDMember'))


// test pages
const TestJinja2 = lazy(() => import('./pages/uitest/testjinja2'))
const React2Jinja2 = lazy(() => import('./pages/uitest/react2jinja2'))

function WaitingComponent ({children, ...props}) {
    return (
        <React.Suspense fallback={<div className='loading'/>}>
            {React.Children.map(children, child => {
                return React.cloneElement(child, {...props})
            })}
        </React.Suspense>
    )
}


const routes = [
    {
        path: '/',
        // element: <h1>App Default</h1>
        element: <Navigate to="/ui/asr" replace/>,
    },
    {
        path: '/ui',
        element: <LabelUILayout />,
        children: [
            {
                path: '',
                element: <h1>Hello</h1>
            },
            {
                path: 'asr',
                element: <AuthComponent><LabelASR /></AuthComponent>,
            }
        ]
    },
    {
        path: '/faceid',
        element: <FaceIDLayout />,
        children: [
            {
                path: '',
                element: <FaceIDMember />,
            },
            {
                path: 'detail',
                element: <FaceIDDetail />
            },
            
        ]
    },
    {
        path: '/test',
        children: [
            {
                path: '',
                element: <h1>Test Default</h1>
            },
            {
                path: 'jinja2',
                element: <TestJinja2 />
            },
            {
                path: 'testTextEditor',
                element: <TestTextEditor />
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