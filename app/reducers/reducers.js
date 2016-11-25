import auth from './auth';
import riot from './riot';

import {
  routerReducer
} from 'react-router-redux';

import {
  combineReducers
} from 'redux';

const rootReducer = combineReducers({
  auth,
  riot,
  routing: routerReducer
});

export default rootReducer;
