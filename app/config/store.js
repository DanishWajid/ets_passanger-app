import {createStore, applyMiddleware} from 'redux';
import logger from 'redux-logger';
import {persistStore, persistCombineReducers} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import reducer from '../reducers';

const middleware = [];
if (process.env.NODE_ENV === 'development') {
  middleware.push (logger);
}

const persistConfig = {
  key: 'root',
  storage,
  blackList: ['network'],
};

const persistReducer = persistCombineReducers (persistConfig, reducer);

const configureStore = () => {
  const store = createStore (persistReducer, applyMiddleware (...middleware));
  const persistor = persistStore (store);
  return {store, persistor};
};

export default configureStore;
