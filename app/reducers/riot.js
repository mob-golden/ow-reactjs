import {
  combineReducers
} from 'redux';

import {
  REQUEST_HEROS,
  RECEIVE_HEROS
} from '../actions/riot';

const initialState = {
  isFetching: false,
  data: null
};

function heros (state = initialState, action) {
  switch (action.type) {
    case REQUEST_HEROS:
      return {
        ...state,
        isFetching: true
      };
    case RECEIVE_HEROS:
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
  heros
});

export default riot;