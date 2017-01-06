import {
  combineReducers
} from 'redux';

import {
  REQUEST_THREADS,
  REQUEST_THREADS_SUCCESS,
  REQUEST_THREADS_FAILURE,
  RECEIVE_THREADS,
  REQUEST_SINGLETHREAD,
  RECEIVE_SINGLETHREAD
} from '../actions/community';

import {
  FORUM_TYPES
} from '../constants/types';

const initializedThreads = FORUM_TYPES.reduce((acc, threadType) => {
  return {
    ...acc,
    [threadType]: null
  };
}, {});

const initialThreadsState = {
  threads: initializedThreads,
  isFetching: false,
};

function threads (state = initialThreadsState, action) {
  switch (action.type) {
    case REQUEST_THREADS:
      return {
        ...state,
        isFetching: true
      };
    case RECEIVE_THREADS:
      const {
        threads
      } = state;

      return {
        ...state,
        threads: {
          ...threads,
          [action.threadType]: action.threads
        }
      };
    case REQUEST_THREADS_SUCCESS:
      return {
        ...state,
        isFetching: false
      };
    case REQUEST_THREADS_FAILURE:
      return {
        ...state,
        isFetching: false
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
  singleThread
});

export default community;