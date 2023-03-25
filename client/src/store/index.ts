import { combineReducers, createStore, applyMiddleware, Middleware } from 'redux';
import { PersistConfig, persistReducer, persistStore } from 'redux-persist';
import { composeWithDevTools } from '@redux-devtools/extension';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import storage from 'redux-persist/lib/storage';

import { userReducer, UserReducerState } from './user/userReducer';

export interface StoreState {
  user: UserReducerState;
}

export const rootReducer = combineReducers<StoreState>({
  user: userReducer
});

const persistConfig: PersistConfig<StoreState> = {
  key: 'root',
  storage,
  whitelist: ['user'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const middlewares: Middleware[] = [thunk];

if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
}

export const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(...middlewares))
);

export const persistor = persistStore(store);
