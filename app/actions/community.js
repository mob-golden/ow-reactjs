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
    let url = `${OW_COMMUNITY_URL}/class/overwatchselect`;
    if(commType != 'all'){
      url += `,${commType}`;
    }
    if(params.page){
      params.page--;
      url += `?sort=${params.sort}&limit=${params.limit}&page=${params.page}-${params.limit}`;
    }

    return fetch(url, {credentials : 'include'})
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


export const REQUEST_ALL_THREADS = 'REQUEST_ALL_THREADS';
export const RECEIVE_ALL_THREADS = 'RECEIVE_ALL_THREADS';

export function fetchAllThreadsIfNeeded (params=defaultParams) {
  return (dispatch, getState) => {
    if (shouldFetchAllThreads(getState()))
      return dispatch(fetchAllThreads(params));
  };
}

function shouldFetchAllThreads (state) {
  const {
    community: {
      allThreads
    }
  } = state;

  if (allThreads.isFetching)
    return false;

  return true;
}

function fetchAllThreads ( params) {
  return dispatch => {
    dispatch(requestAllThreads());
    let url = `${OW_COMMUNITY_URL}/class/overwatchselect`;
    
    return fetch(url, {credentials : 'include'})
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
      .then(threads => dispatch(receiveAllThreads(threads)));
  };
}

function requestAllThreads () {
  return {
    type: REQUEST_ALL_THREADS
  };
}

function receiveAllThreads (threads) {
  return {
    type: RECEIVE_ALL_THREADS,
    threads
  };
}


//====================================================================================


export const REQUEST_SINGLETHREAD = 'REQUEST_SINGLETHREAD';
export const RECEIVE_SINGLETHREAD = 'RECEIVE_SINGLETHREAD';


export function fetchSingleThreadIfNeeded (threadId, params=defaultParams) {

  return (dispatch, getState) => {
    if (shouldFetchSingleThread(getState(),threadId))
      return dispatch(fetchSingleThread(threadId, params));
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

function fetchSingleThread (threadId, params) {
  return dispatch => {
    dispatch(requestSingleThread());
    const url = `${OW_COMMUNITY_URL}/item/${threadId}?${qs.stringify(params)}`;

    return fetch(url, {credentials : 'include'})
      .then(response => {
        const {
          status,
          statusText
        } = response;

        if (response.status >= 200 && response.status < 300) {
          return response;
        } else {
          if(status == 404){
            window.location.href = "/404";
            return;
          }
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
