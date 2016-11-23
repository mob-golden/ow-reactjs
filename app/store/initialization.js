import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { routerReducer } from 'react-router-redux';
import {news} from '../reducers/reducers';

export default function (data) {
  var reducer = combineReducers({
    news,
    routing: routerReducer
});

  var createFinalStore = applyMiddleware(thunk)(createStore);
  var store = createFinalStore(reducer, data);
  return store;
}
