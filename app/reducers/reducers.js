import auth from './auth';
import hero from './hero';
import map from './map';
import api from './api';
import community from './community';

import {
  routerReducer
} from 'react-router-redux';

import {
  combineReducers
} from 'redux';

const rootReducer = combineReducers({
  auth,
  api,
  hero,
  map,
  community,
  routing: routerReducer
});

export default rootReducer;
