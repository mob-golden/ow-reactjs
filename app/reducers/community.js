import {
  combineReducers
} from 'redux';

import {
  REQUEST_THREADS,
  RECEIVE_THREADS,
  REQUEST_SINGLETHREAD,
  RECEIVE_SINGLETHREAD,
  REQUEST_ALL_THREADS,
  RECEIVE_ALL_THREADS,
} from '../actions/community';

import {
  FORUM_TYPES
} from '../constants/types';


const initialThreadsState = {
  isFetching: false,
  threads: null
};

function threads (state = initialThreadsState, action) {
  switch (action.type) {
    case REQUEST_THREADS:
      return {
        ...state,
        isFetching: true
      };
    case RECEIVE_THREADS:
      return {
        ...state,
        isFetching: false,
        threads: action.threads
      };
    default:
      return state;
  }
}


const initialAllThreadsState = {
  isFetching: false,
  allThreads: null
};

function allThreads (state = initialAllThreadsState, action) {
  switch (action.type) {
    case REQUEST_ALL_THREADS:
      return {
        ...state,
        isFetching: true
      };
    case RECEIVE_ALL_THREADS:
      return {
        ...state,
        isFetching: false,
        allThreads: action.threads
      };
    default:
      return state;
  }
}


const initialSingleThreadState = {
  isFetching: false,
  singleThread: null
};

function singleThread (state = initialSingleThreadState, action) {
  switch (action.type) {
    case REQUEST_SINGLETHREAD:
      return {
        ...state,
        isFetching: true
      };
    case RECEIVE_SINGLETHREAD:
      return {
        ...state,
        isFetching: false,
        singleThread: action.singleThread
      };
    default:
      return state;
  }
}


const community = combineReducers({
  threads,
  allThreads,
  singleThread
});

export default community;