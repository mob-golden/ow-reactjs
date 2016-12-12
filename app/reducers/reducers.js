import auth from './auth';
import riot from './riot';
import map from './map';
import api from './api';
import matchup from './matchup';

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
  matchup,
  routing: routerReducer
});

export default rootReducer;
