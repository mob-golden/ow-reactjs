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
export const REQUEST_THREADS_SUCCESS = 'REQUEST_THREADS_SUCCESS';
export const REQUEST_THREADS_FAILURE = 'REQUEST_THREADS_FAILURE';
export const RECEIVE_THREADS = 'RECEIVE_THREADS';


export function fetchThreadsIfNeeded () {
  // const params = {
  //   sort: 'score.total-desc'
  // };

  return (dispatch, getState) => {
    if (shouldFetchThreads(getState()))
      return dispatch(fetchThreads());
  };
}

function shouldFetchThreads (state) {
  const {
    community: {
      threads
    }
  } = state;

  if (threads.isFetching)
    return false;

  return true;
}

function fetchThreads () {
  return dispatch => {
    dispatch(requestThreads());

    Promise.all(FORUM_TYPES.map(type => {

      const url = `${OW_COMMUNITY_URL}/class/overwatchselect,${type}`;

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
        .then(threads => dispatch(receiveThreads(threads, type)))
    }))
      .then(responses => {
        dispatch(requestThreadsSuccess(responses));
      })
      .catch(error => {
        console.log(`Response returned an error for fetching threads : ${error.message}`);
        dispatch(requestThreadsFailure(error));
      });
  };
}

function requestThreads () {
  return {
    type: REQUEST_THREADS
  };
}

function requestThreadsSuccess (responses) {
  return {
    type: REQUEST_THREADS_SUCCESS,
    responses
  };
}

function requestThreadsFailure (error) {
  return {
    type: REQUEST_THREADS_FAILURE,
    error
  };
}

function receiveThreads (threads, threadType) {
  return {
    type: RECEIVE_THREADS,
    threadType,
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
