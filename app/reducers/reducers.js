import auth from './auth';
import riot from './riot';
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
  matchup,
  routing: routerReducer
});

export default rootReducer;
