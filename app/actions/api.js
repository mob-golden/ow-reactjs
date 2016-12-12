import fetch from 'isomorphic-fetch';
import qs from 'querystring'

import {
  MATCHUP_TYPES
} from '../constants/types';

import {
  OW_HERO_URL,
  OW_MATCHUPS_URL
} from '../constants/urls';

export const REQUEST_SINGLE_HERO = 'REQUEST_SINGLEHERO';
// export const REQUEST_SINGLE_HERO_SUCCESS = 'REQUEST_TIPS_SUCCESS';
// export const REQUEST_SINGLE_HERO_FAILURE = 'REQUEST_TIPS_FAILURE';
export const RECEIVE_SINGLE_HERO = 'RECEIVE_SINGLEHERO';

export function fetchSingleHero(heroKey) {
  return dispatch => {
    const params = {
      // limit: 100,
      sort: 'score.total-desc',
      // order: -1
    };

    return dispatch(fetchSingleHeroIfNeeded(heroKey, params));
  };
}
export function fetchSingleHeroIfNeeded (heroKey, params) {
  return (dispatch, getState) => {
    if (shouldFetchSingleHero(getState(), heroKey)) {
      const root = `${OW_HERO_URL}/${heroKey}`;
      const fullUrl = `${root}?${qs.stringify(params)}`;

      return dispatch(fetchSingleHeroData(fullUrl, heroKey));
    }
  };
}

function shouldFetchSingleHero (state, heroKey) {
  const {
    api: {
      singleHero
    }
  } = state;

  if (singleHero.isFetching)
    return false;

  // if ((singleHero.isFetching || heroKey === singleHero.heroKey))
  //   return false;

  return true;
}

function fetchSingleHeroData (url, heroKey) {
  return dispatch => {
    dispatch(requestSingleHero(heroKey));

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
      .then(json => dispatch(receiveSingleHero(json)))
      .catch (error => {
        console.log(`Request failed for ${url}: ${error.message}`);
      });
  }
}

function requestSingleHero (heroKey) {
  return {
    type: REQUEST_SINGLE_HERO,
    heroKey
  };
}

function receiveSingleHero (data) {
  return {
    type: RECEIVE_SINGLE_HERO,
    data
  };
}

function invalidateSingleHero () {
  return {
    type: INVALIDATE_SINGLE_HERO,
  };
}

export const REQUEST_MATCHUP_TIPS = 'REQUEST_MATCHUP_TIPS';
export const RECEIVE_MATCHUP_TIPS = 'RECEIVE_MATCHUP_TIPS';

export function fetchMatchupTipsIfNeeded (heroKey, matchupHeroKey, params) {
  return (dispatch, getState) => {
    if (shouldFetchMatchupTips(getState(), heroKey, matchupHeroKey)) {
      const url = `${CS_TIPS_URL}?${qs.stringify(params)}`;

      return dispatch(fetchMatchupTips(url));
    }
  };
}

function shouldFetchMatchupTips (state, heroKey, matchupHeroKey) {
  const {
    api: {
      matchupTips
    }
  } = state;

  if (matchupTips.isFetching)
    return false;

  return true;
}

function fetchMatchupTips (url, heroKey, matchupHeroKey) {
  return dispatch => {
    dispatch(requestMatchupTips(heroKey, matchupHeroKey));

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
      .then(json => dispatch(receiveMatchupTips(json)))
      .catch (error => {
        console.log(`Request failed for ${url}: ${error.message}`);
      });
  }
}

function requestMatchupTips (heroKey, matchupHeroKey) {
  return {
    type: REQUEST_MATCHUP_TIPS,
    heroKey,
    matchupHeroKey
  };
}

function receiveMatchupTips (data) {
  return {
    type: RECEIVE_MATCHUP_TIPS,
    data
  };
}

export const REQUEST_MATCHUPS = 'REQUEST_MATCHUPS';
export const REQUEST_MATCHUPS_SUCCESS = 'REQUEST_MATCHUPS_SUCCESS';
export const REQUEST_MATCHUPS_FAILURE = 'REQUEST_MATCHUPS_FAILURE';
export const RECEIVE_MATCHUP = 'RECEIVE_MATCHUP';

export function fetchMatchupsForHero (heroKey) {
  return dispatch => {
    const params = {
      // 50 is the max limit
      //limit: 50,
      sort: 'score.total-desc',
      //order: -1,
      //page: 1
    };

    return dispatch(fetchMatchupsIfNeeded(heroKey, params));
  };
}

export function fetchMatchupsIfNeeded (heroKey, params) {
  return (dispatch, getState) => {
    if (shouldFetchMatchups(getState(), heroKey))
      return dispatch(fetchMatchups(heroKey, params));
  };
}

function shouldFetchMatchups (state, heroKey) {
  const {
    api: {
      matchups
    }
  } = state;

  if (matchups.isFetching)
    return false;

  // if (matchups.isFetching || heroKey === matchups.heroKey)
  //   return false;

  return true;
}

function fetchMatchups (heroKey, params) {
  return dispatch => {
    dispatch(requestMatchups(heroKey));

    Promise.all(MATCHUP_TYPES.map(matchupType => {

      // `/matchups/:heroKey` returns matchups from all types
      const typeUrlSegment = `?type=${matchupType}`;
      const root = `${OW_MATCHUPS_URL}/${heroKey}${typeUrlSegment}`;
      const fullUrl = `${root}&${qs.stringify(params)}`;

      return fetch(fullUrl)
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
        .then(matchup => dispatch(receiveMatchup(matchup, heroKey, matchupType)))
    }))
      .then(responses => {
        dispatch(requestMatchupsSuccess(responses));
      })
      .catch(error => {
        console.log(`Response returned an error for fetching matchups for ${heroKey}: ${error.message}`);
        dispatch(requestMatchupsFailure(error));
      });
  };
}

function requestMatchups (heroKey) {
  return {
    type: REQUEST_MATCHUPS,
    heroKey
  };
}

function requestMatchupsSuccess (responses) {
  return {
    type: REQUEST_MATCHUPS_SUCCESS,
    responses
  };
}

function requestMatchupsFailure (error) {
  return {
    type: REQUEST_MATCHUPS_FAILURE,
    error
  };
}

function receiveMatchup (matchup, heroKey, matchupType) {
  return {
    type: RECEIVE_MATCHUP,
    heroKey,
    matchupType,
    matchup
  };
}
