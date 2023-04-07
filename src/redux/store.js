import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';


import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

const bindMiddleware = middleware => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension');
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

function configureStore() {
  const middlewares = [];
  const sagaMiddleware = createSagaMiddleware();
  // if (process.env.NODE_ENV !== 'production' && process.browser) {
  //   const loggerMiddleware = createLogger({
  //     collapsed: (getState, action, logEntry) => !logEntry.error,
  //   });
  //   middlewares.push(loggerMiddleware);
  // }
  middlewares.push(sagaMiddleware);
  const store = createStore(
    rootReducer,
    bindMiddleware(middlewares)
  );

  store.sagaTask = sagaMiddleware.run(rootSaga);

  return store;
}

export default configureStore;
