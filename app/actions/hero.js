import fetch from 'isomorphic-fetch';
import qs from 'querystring'

import {
  OW_HEROES_URL
} from '../constants/urls';

export const REQUEST_HEROES = 'REQUEST_HEROES';
export const RECEIVE_HEROES = 'RECEIVE_HEROES';

export function fetchHeroesIfNeeded () {
  const params = {
    sort: 'type-asc,id-asc'
  };
  return (dispatch, getState) => {
    if (shouldFetchHeroes(getState())) {
      return dispatch(fetchHeroes(`${OW_HEROES_URL}?${qs.stringify(params)}`));
    }
  };
}

function shouldFetchHeroes (state) {
  const {
    hero: {
      heroes
    }
  } = state;

  if (heroes.isFetching)
    return false;
  return true;
}

function fetchHeroes (url) {
  return dispatch => {
    dispatch(requestHeroes());

    return fetch(url, {credentials : 'include',})
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

  return {
    type: RECEIVE_HEROES,
    data
  };
}
