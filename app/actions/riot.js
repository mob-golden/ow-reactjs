import fetch from 'isomorphic-fetch';
import mapKeys from 'lodash/mapKeys';

import {
  RIOT_HEROES_URL
} from '../constants/urls';

// import {
//   callApiIfNeeded
// } from '../utils/api';

export const REQUEST_HEROES = 'REQUEST_HEROES';
// export const REQUEST_HEROES_SUCCESS = 'REQUEST_HEROES_SUCCESS';
// export const REQUEST_HEROES_FAILURE = 'REQUEST_HEROES_FAILURE';
export const RECEIVE_HEROES = 'RECEIVE_HEROES';

// export function fetchHeroes () {
//   return (dispatch, getState) => {
//     const types = {
//       request: REQUEST_HEROES,
//       success: REQUEST_HEROES_SUCCESS,
//       failure: REQUEST_HEROES_FAILURE,
//       receive: RECEIVE_HEROES
//     };
//
//     return dispatch(callApiIfNeeded(RIOT_HEROES_URL, types, getState()));
//   };
// }

export function fetchHeroesIfNeeded () {
  return (dispatch, getState) => {
    if (shouldFetchHeroes(getState())) {
      return dispatch(fetchHeroes(RIOT_HEROES_URL));
    }
  };
}

function shouldFetchHeroes (state) {
  const {
    riot: {
      heroes
    }
  } = state;

  // if (heroes.isFetching)
  //   return false;

  return true;
}

function fetchHeroes (url) {
  return dispatch => {
    dispatch(requestHeroes());

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
      .then(json => dispatch(receiveHeroes(json)))
      .catch (error => {
        console.log(`Request failed for ${url}: ${error.message}`);
      });
  }
}

function requestHeroes () {
  return {
    type: REQUEST_HEROES
  };
}

function receiveHeroes (data) {
  const cleanedData = mapKeys(data.data, (v, k) => ("" + k).replace(/[-\+'`´\s]+/g, '').toLowerCase());
  data.data = cleanedData;

  return {
    type: RECEIVE_HEROES,
    data
  };
}
