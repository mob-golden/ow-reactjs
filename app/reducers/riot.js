import {
  combineReducers
} from 'redux';

import {
  REQUEST_HEROES,
  RECEIVE_HEROES
} from '../actions/riot';

const initialState = {
  isFetching: false,
  data: null
};

function heroes (state = initialState, action) {
  switch (action.type) {
    case REQUEST_HEROES:
      return {
        ...state,
        isFetching: true
      };
    case RECEIVE_HEROES:
      return {
        ...state,
        isFetching: false,
        data: action.data
      };
    default:
      return state;
  }
}

const riot = combineReducers({
  heroes
});

export default riot;