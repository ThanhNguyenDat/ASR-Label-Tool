import React, { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom'
import withAuthRequired from './hocs/withAuthRequired';
import { LabelUILayout } from './layout/LabelUILayout';

// pages
const LoginPage = lazy(() => import('./pages/login'));
const Notfound = lazy(() => import('./pages/notfound'));

// function WaitingComponent(Component) {
//     return function(props) {
//       return (
//         <Suspense fallback={<div className="loading" />}>
//             <Component {...props} />
          
//         </Suspense>
//     );}
//   }

function WaitingComponent(Component, props=null) {
    const rest = {...props};
    return (
      <Suspense fallback={<div className="loading" />}>
          <Component {...rest}/>
      </Suspense>
  );
}


const routes = [
    {
        path: '/',
        element: <Navigate to="/react_label_ui" replace/>,
        exact: true,
    },
    { 
        path: '/react_label_ui',
        element: <LabelUILayout />, // Layout of react_label_ui
        children: [
            {
              path: '/react_label_ui',
              element: <h1>App Default</h1>  // content of children
            },
            {
              path: '/react_label_ui/ui/asr',
              element: <h1>ui-asr</h1>
            },
        ]
    },
    {
        path: '/auth/login',
        element: WaitingComponent(LoginPage),
    },
    { path: '*', element: WaitingComponent(Notfound) },
]




export default routes;