import fetch from 'isomorphic-fetch';
import qs from 'querystring'

import {
  LANES
} from '../constants/types';

import {
  CS_CHAMPION_URL,
  CS_COUNTER_TIPS_URL
} from '../constants/urls';

// import {
//   callApi,
//   callApiIfNeeded
// } from '../utils/api';

export const REQUEST_CHAMPION = 'REQUEST_CHAMPION';
// export const REQUEST_CHAMPION_SUCCESS = 'REQUEST_CHAMPION_SUCCESS';
// export const REQUEST_CHAMPION_FAILURE = 'REQUEST_CHAMPION_FAILURE';
export const RECEIVE_CHAMPION = 'RECEIVE_CHAMPION';

export function fetchHeroIfNeeded (heroKey) {
  return (dispatch, getState) => {
    if (shouldFetchHero(getState(), heroKey)) {
      return dispatch(fetchHero(heroKey));
    }
  };
}

function shouldFetchHero (state, heroKey) {
  const {
    api: {
      hero
    }
  } = state;

  if (hero.isFetching || heroKey === hero.heroKey)
    return false;

  return true;
}

// function fetchHero (heroKey) {
//   return (dispatch, getState) => {
//     const types = {
//       request: REQUEST_CHAMPION,
//       success: REQUEST_CHAMPION_SUCCESS,
//       failure: REQUEST_CHAMPION_FAILURE,
//       receive: RECEIVE_CHAMPION
//     };
//
//     const fullUrl = `${CS_CHAMPION_URL}/${heroKey}`;
//
//     return dispatch(callApi(fullUrl, types));
//   };
// }

function fetchHero (heroKey) {
  return dispatch => {
    dispatch(requestHero(heroKey));

    const url = `${CS_CHAMPION_URL}/${heroKey}`

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
      .then(json => dispatch(receiveHero(json)))
      .catch (error => {
        console.log(`Request failed for ${url}: ${error.message}`);
      });
  }
}

function requestHero (heroKey) {
  return {
    type: REQUEST_CHAMPION,
    heroKey
  };
}

function receiveHero (data) {
  return {
    type: RECEIVE_CHAMPION,
    data
  };
}

export const REQUEST_COUNTER_TIPS = 'REQUEST_COUNTER_TIPS';
// export const REQUEST_COUNTER_TIPS_SUCCESS = 'REQUEST_COUNTER_TIPS_SUCCESS';
// export const REQUEST_COUNTER_TIPS_FAILURE = 'REQUEST_COUNTER_TIPS_FAILURE';
export const RECEIVE_COUNTER_TIPS = 'RECEIVE_COUNTER_TIPS';

// TODO: abstract into fetching general counter tips and counter tips for
// heroes

export function fetchCounterTipsForHero (heroKey) {
  return dispatch => {
    const params = {
      limit: 100,
      orderBy: 'score',
      order: -1
    };

    return dispatch(fetchCounterTipsIfNeeded(heroKey, params));
  };
}
export function fetchCounterTipsIfNeeded (heroKey, params) {
  return (dispatch, getState) => {
    if (shouldFetchCounterTips(getState(), heroKey)) {
      const root = `${CS_CHAMPION_URL}/${heroKey}/general/countertips`;
      const fullUrl = `${root}?${qs.stringify(params)}`;

      return dispatch(fetchCounterTips(fullUrl, heroKey));
    }
  };
}

function shouldFetchCounterTips (state, heroKey) {
  const {
    api: {
      counterTips
    }
  } = state;

  if (counterTips.isFetching)
    return false;

  // if ((counterTips.isFetching || heroKey === counterTips.heroKey))
  //   return false;

  return true;
}

function fetchCounterTips (url, heroKey) {
  return dispatch => {
    dispatch(requestCounterTips(heroKey));

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
      .then(json => dispatch(receiveCounterTips(json)))
      .catch (error => {
        console.log(`Request failed for ${url}: ${error.message}`);
      });
  }
}

function requestCounterTips (heroKey) {
  return {
    type: REQUEST_COUNTER_TIPS,
    heroKey
  };
}

function receiveCounterTips (data) {
  return {
    type: RECEIVE_COUNTER_TIPS,
    data
  };
}

function invalidateCounterTips () {
  return {
    type: INVALIDATE_COUNTER_TIPS,
  };
}

export const REQUEST_MATCHUP_COUNTER_TIPS = 'REQUEST_MATCHUP_COUNTER_TIPS';
export const RECEIVE_MATCHUP_COUNTER_TIPS = 'RECEIVE_MATCHUP_COUNTER_TIPS';

export function fetchMatchupCounterTipsIfNeeded (heroKey, matchupHeroKey, params) {
  return (dispatch, getState) => {
    if (shouldFetchMatchupCounterTips(getState(), heroKey, matchupHeroKey)) {
      const url = `${CS_COUNTER_TIPS_URL}?${qs.stringify(params)}`;

      return dispatch(fetchMatchupCounterTips(url));
    }
  };
}

function shouldFetchMatchupCounterTips (state, heroKey, matchupHeroKey) {
  const {
    api: {
      matchupCounterTips
    }
  } = state;

  if (matchupCounterTips.isFetching)
    return false;

  return true;
}

function fetchMatchupCounterTips (url, heroKey, matchupHeroKey) {
  return dispatch => {
    dispatch(requestMatchupCounterTips(heroKey, matchupHeroKey));

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
      .then(json => dispatch(receiveMatchupCounterTips(json)))
      .catch (error => {
        console.log(`Request failed for ${url}: ${error.message}`);
      });
  }
}

function requestMatchupCounterTips (heroKey, matchupHeroKey) {
  return {
    type: REQUEST_MATCHUP_COUNTER_TIPS,
    heroKey,
    matchupHeroKey
  };
}

function receiveMatchupCounterTips (data) {
  return {
    type: RECEIVE_MATCHUP_COUNTER_TIPS,
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
      limit: 50,
      orderBy: 'score',
      order: -1,
      page: 1
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

    Promise.all(LANES.map(lane => {

      // `/hero/:name/matchups returns matchups from all lanes
      const laneUrlSegment = (lane === 'all') ? '' : `/${lane}`;
      const root = `${CS_CHAMPION_URL}/${heroKey}/matchups${laneUrlSegment}`;
      const fullUrl = `${root}?${qs.stringify(params)}`;

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
        .then(matchup => dispatch(receiveMatchup(matchup, heroKey, lane)))
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

function receiveMatchup (matchup, heroKey, lane) {
  return {
    type: RECEIVE_MATCHUP,
    heroKey,
    lane,
    matchup
  };
}
