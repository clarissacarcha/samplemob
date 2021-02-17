import {createStore, combineReducers, compose} from 'redux';
import reducers from './reducers';

const combinedReducers = combineReducers(reducers);

let composeEnhancers = compose();

if (__DEV__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

const configureStore = () => {
  return createStore(combinedReducers, composeEnhancers());
};

export default configureStore;
