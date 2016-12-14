import auth from './auth';
import riot from './riot';
import map from './map';
import api from './api';

import {
  routerReducer
} from 'react-router-redux';

import {
  combineReducers
} from 'redux';

const rootReducer = combineReducers({
  auth,
  api,
  riot,
  map,
  routing: routerReducer
});

export default rootReducer;
