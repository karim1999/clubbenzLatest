import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from 'redux-persist'
import promise from "redux-promise";
import {createLogger} from "redux-logger";
import storage from 'redux-persist/lib/storage'
import rootReducer from "./reducers";
const persistConfig = {
  key: 'root',
  storage,
  whitelist:['auth','init','language']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
const logger = createLogger();
const enhancer = compose(
  applyMiddleware(thunk, promise),
  applyMiddleware(promise)
);
let store = createStore(persistedReducer,{},enhancer)
let persistor = persistStore(store)

export  { store, persistor }
