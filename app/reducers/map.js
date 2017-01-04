import { combineReducers } from 'redux';
import { toArray } from 'lodash';

import {
  REQUEST_MAPS,
  RECEIVE_MAPS
} from '../actions/map';

const initialState = {
  isFetching: false,
  data: null
};

function maps (state = initialState, action) {
  switch (action.type) {
    case REQUEST_MAPS:
      return {
        ...state,
        isFetching: true
      };
    case RECEIVE_MAPS:
      return {
        ...state,
        isFetching: false,
        _hash: action.data.data,
        _array: toArray(action.data.data)
      };
    default:
      return state;
  }
}

const map = combineReducers({
  maps
});

export default map;