import { combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import localforage from 'localforage'
import { createBrowserHistory } from 'history'
import configureStore from '~/configureStore'

const history = createBrowserHistory()

const persistConfig = {
  key: 'root',
  storage: localforage,
  blacklist: [],
  transforms: [],
  timeout: null,
}

/* ------------- Assemble The Reducers ------------- */
const reducers = combineReducers({
  app: require('./app').reducer,
  develop: require('./develop').reducer,
  manage: require('./manage').reducer,
  vendor: require('./vendor').reducer,
  company: require('./company').reducer,
  community: require('./community').reducer,
})

const persistedReducer = persistReducer(persistConfig, reducers)

const initialState = {}

const store = configureStore(initialState, persistedReducer, history)

const persistor = persistStore(store)

export { store, persistor, history }
