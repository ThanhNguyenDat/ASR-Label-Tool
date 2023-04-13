import React, { lazy, Suspense } from 'react';
import { Provider } from 'react-redux'

import {
  createBrowserRouter,
  RouterProvider,
  BrowserRouter, 
  Route,
  Routes,
  Await,
  Switch,
  Outlet,
} from "react-router-dom";

import configureStore from './redux/store';
import routes from './routes';
// import { privateRoutes, publicRoutes } from './routes';
import AuthComponent from './hocs/withAuthRequired';

const store = configureStore();
const router = createBrowserRouter(routes);
// const privateRouter = createBrowserRouter(privateRoutes);

function App() {
  
  return (
    <Provider store={store}>
      
      <RouterProvider router={router} />
      
    </Provider>
  )
}

export default App;