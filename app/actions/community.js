import fetch from 'isomorphic-fetch';
import qs from 'querystring'

import {
  FORUM_TYPES
} from '../constants/types';

import {
  OW_COMMUNITY_URL
} from '../constants/urls';

//================================Community threads API=================================//

export const REQUEST_THREADS = 'REQUEST_THREADS';
export const RECEIVE_THREADS = 'RECEIVE_THREADS';

// 12 items from newest
const defaultParams = {
  limit: 6,
  sort: 'date-desc'
};

export function fetchThreadsIfNeeded (commType, params=defaultParams) {
  return (dispatch, getState) => {
    if (shouldFetchThreads(getState(), commType))
      return dispatch(fetchThreads(commType, params));
  };
}

function shouldFetchThreads (state, commType) {
  const {
    community: {
      threads
    }
  } = state;

  if (threads.isFetching)
    return false;

  return true;
}

function fetchThreads (commType, params) {
  return dispatch => {
    dispatch(requestThreads());
    if(params.page) params.page--;
    const url = `${OW_COMMUNITY_URL}/class/overwatchselect,${commType}?${qs.stringify(params)}`;

    return fetch(url)
      .then(response => {
        const {
          status,
          statusText
        } = response;

        if (response.status >= 200 && response.status < 300) {
          return response;
        } else {
          const error = new Error(statusText);
          console.log(`Response returned an error for ${url}: ${error.message}`);

          return Promise.reject(error);
        }
      })
      .then(response => response.json())
      .then(threads => dispatch(receiveThreads(threads)));
  };
}

function requestThreads () {
  return {
    type: REQUEST_THREADS
  };
}

function receiveThreads (threads) {
  return {
    type: RECEIVE_THREADS,
    threads
  };
}


//====================================================================================


export const REQUEST_SINGLETHREAD = 'REQUEST_SINGLETHREAD';
export const RECEIVE_SINGLETHREAD = 'RECEIVE_SINGLETHREAD';


export function fetchSingleThreadIfNeeded (threadId) {
  // const params = {
  //   sort: 'score.total-desc'
  // };

  return (dispatch, getState) => {
    if (shouldFetchSingleThread(getState(),threadId))
      return dispatch(fetchSingleThread(threadId));
  };
}

function shouldFetchSingleThread (state) {
  const {
    community: {
      singleThread
    }
  } = state;

  if (singleThread.isFetching)
    return false;

  return true;
}

function fetchSingleThread (threadId) {
  return dispatch => {
    dispatch(requestSingleThread());

    const url = `${OW_COMMUNITY_URL}/item/${threadId}`;

    return fetch(url)
      .then(response => {
        const {
          status,
          statusText
        } = response;

        if (response.status >= 200 && response.status < 300) {
          return response;
        } else {
          const error = new Error(statusText);
          console.log(`Response returned an error for ${url}: ${error.message}`);

          return Promise.reject(error);
        }
      })
      .then(response => response.json())
      .then(singleThread => dispatch(receiveSingleThread(singleThread)))
      .catch (error => {
        console.log(`Request failed for ${url}: ${error.message}`);
      });
  };
}

function requestSingleThread () {
  return {
    type: REQUEST_SINGLETHREAD
  };
}


function receiveSingleThread (singleThread) {
  return {
    type: RECEIVE_SINGLETHREAD,
    singleThread
  };
}
