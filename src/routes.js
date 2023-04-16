import React, { Component, lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom'
// import withAuthRequired from './hocs/withAuthRequired';
import AuthComponent from './hocs/withAuthRequired'
import LabelUILayout from './layouts/LabelUILayout';
import FaceIDLayout from './layouts/FaceIDLayout';

// pages
const LoginPage = lazy(() => import('./pages/login'));
const Notfound = lazy(() => import('./pages/notfound'));

// label pages
const LabelASR = lazy(() => import('./pages/uilabel/asr'))

// faceid pages
const FaceIDMember = lazy(() => import('./pages/faceid/FaceIDMember'))
const FaceIDAdmin = lazy(() => import('./pages/faceid/FaceIDAdmin'))

// test pages
const TestJinja2 = lazy(() => import('./pages/uitest/testjinja2'))


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
        element: <Navigate to="/react_label_ui/ui/asr" replace/>,
        exact: true,
    },
    {
        path: '/react_label_ui',
        // element: <AppLayout />, // Layout of react_label_ui // header default
        children: [
            {
                path: '/react_label_ui',
                element: <AuthComponent><h1>App Default</h1></AuthComponent>
            },
            {
                path: '/react_label_ui/ui',
                element: <LabelUILayout />,
                children: [
                    {
                        path: '/react_label_ui/ui',
                        element: <h1>Hello</h1>
                    },
                    {
                        path: '/react_label_ui/ui/asr',
                        element: <AuthComponent><LabelASR /></AuthComponent>,
                    }
                ]
            },
            {
                path: '/react_label_ui/faceid',
                element: <FaceIDLayout />,
                children: [
                    {
                        path: '/react_label_ui/faceid',
                        element: <FaceIDMember />,
                    },
                ]
            },
            {
                path: '/react_label_ui/admin',
                children: [
                    {
                        path: '/react_label_ui/admin',
                        element: <FaceIDAdmin />
                    }
                ]
            }
        ]
    },
    {
        path: '/test',
        children: [
            {
                path: '/test',
                element: <h1>Test Default</h1>
            },
            {
                path: '/test/ui/jinja2',
                element: <TestJinja2 />
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