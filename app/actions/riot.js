import fetch from 'isomorphic-fetch';
import mapKeys from 'lodash/mapKeys';

import {
  RIOT_HEROS_URL
} from '../constants/urls';

// import {
//   callApiIfNeeded
// } from '../utils/api';

export const REQUEST_HEROS = 'REQUEST_HEROS';
// export const REQUEST_HEROS_SUCCESS = 'REQUEST_HEROS_SUCCESS';
// export const REQUEST_HEROS_FAILURE = 'REQUEST_HEROS_FAILURE';
export const RECEIVE_HEROS = 'RECEIVE_HEROS';

// export function fetchHeros () {
//   return (dispatch, getState) => {
//     const types = {
//       request: REQUEST_HEROS,
//       success: REQUEST_HEROS_SUCCESS,
//       failure: REQUEST_HEROS_FAILURE,
//       receive: RECEIVE_HEROS
//     };
//
//     return dispatch(callApiIfNeeded(RIOT_HEROS_URL, types, getState()));
//   };
// }

export function fetchHerosIfNeeded () {
  return (dispatch, getState) => {
    if (shouldFetchHeros(getState())) {
      return dispatch(fetchHeros(RIOT_HEROS_URL));
    }
  };
}

function shouldFetchHeros (state) {
  const {
    riot: {
      heros
    }
  } = state;

  // if (heros.isFetching)
  //   return false;

  return true;
}

function fetchHeros (url) {
  return dispatch => {
    dispatch(requestHeros());

    return fetch(url)
      .then(response => {
        const {
          status,
          statusText
        } = response;

        if (status >= 200 && status < 300) {
          return response;
        } else {
          const error = new Error(statusText);
          console.log(`Response returned an error for ${url}: ${error.message}`);

          return Promise.reject(error);
        }
      })
      .then(response => response.json())
      .then(json => dispatch(receiveHeros(json)))
      .catch (error => {
        console.log(`Request failed for ${url}: ${error.message}`);
      });
  }
}

function requestHeros () {
  return {
    type: REQUEST_HEROS
  };
}

function receiveHeros (data) {
  const cleanedData = mapKeys(data.data, (v, k) => ("" + k).replace(/[-\+'`´\s]+/g, '').toLowerCase());
  data.data = cleanedData;

  return {
    type: RECEIVE_HEROS,
    data
  };
}
