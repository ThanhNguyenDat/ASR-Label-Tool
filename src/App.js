import React, { lazy, Suspense } from 'react';
import { Provider } from 'react-redux'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import routes from './routes';

const router = createBrowserRouter(routes, {
  basename: '/react_label_ui'
});

function App() {
  return (
    <RouterProvider router={router}/>
  )
}

export default App;