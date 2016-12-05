import fetch from 'isomorphic-fetch';
import qs from 'querystring';

import {
  CS_CHAMPION_URL
} from '../constants/urls';

export const REQUEST_MATCHUP_COUNTER_TIPS = 'REQUEST_MATCHUP_COUNTER_TIPS';
export const RECEIVE_MATCHUP_COUNTER_TIPS = 'RECEIVE_MATCHUP_COUNTER_TIPS';

// 50 items with highest score in descending order
const defaultParams = {
  limit: 100,
  orderBy: 'score',
  order: -1
};

export function fetchCounterTipsIfNeeded (heroKey, matchupHeroKey, params = defaultParams) {
  return (dispatch, getState) => {
    if (shouldFetchCounterTips(getState(), heroKey, matchupHeroKey)) {
      const root = `${CS_CHAMPION_URL}/${heroKey}/${matchupHeroKey}/countertips`;
      const fullUrl = `${root}?${qs.stringify(params)}`;

      return dispatch(fetchCounterTips(fullUrl, heroKey, matchupHeroKey));
    }
  };
}

function shouldFetchCounterTips (state, heroKey, matchupHeroKey) {
  const {
    matchup: {
      counterTips
    }
  } = state;

  if (counterTips.isFetching)
    return false;

  // if (counterTips.isFetching || (heroKey === counterTips.heroKey && matchupHeroKey === counterTips.matchupHeroKey))
  //   return false;

  return true;
}

function fetchCounterTips (url, heroKey, matchupHeroKey) {
  return dispatch => {
    dispatch(requestCounterTips(heroKey, matchupHeroKey));

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

function requestCounterTips (heroKey, matchupHeroKey) {
  return {
    type: REQUEST_MATCHUP_COUNTER_TIPS,
    heroKey,
    matchupHeroKey
  };
}

function receiveCounterTips (data) {
  return {
    type: RECEIVE_MATCHUP_COUNTER_TIPS,
    data
  };
}

export const REQUEST_MATCHUP_MATCHUPS = 'REQUEST_MATCHUP_MATCHUPS';
export const RECEIVE_MATCHUP_MATCHUPS = 'RECEIVE_MATCHUP_MATCHUPS';

export function fetchMatchupsIfNeeded (heroKey, matchupHeroKey, params = defaultParams) {
  return (dispatch, getState) => {
    if (shouldFetchMatchups(getState(), heroKey, matchupHeroKey)) {
      const root = `${CS_CHAMPION_URL}/${heroKey}/${matchupHeroKey}/matchups`;
      const fullUrl = `${root}?${qs.stringify(params)}`;

      return dispatch(fetchMatchups(fullUrl, heroKey, matchupHeroKey));
    }
  };
}

function shouldFetchMatchups (state, heroKey, matchupHeroKey) {
  const {
    matchup: {
      matchups
    }
  } = state;

  if (matchups.isFetching || (heroKey === matchups.heroKey && matchupHeroKey === matchups.matchupHeroKey))
    return false;

  return true;
}

function fetchMatchups (url, heroKey, matchupHeroKey) {
  return dispatch => {
    dispatch(requestMatchups(heroKey, matchupHeroKey));

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
      .then(json => dispatch(receiveMatchups(json)))
      .catch (error => {
        console.log(`Request failed for ${url}: ${error.message}`);
      });
  }
}

function requestMatchups (heroKey, matchupHeroKey) {
  return {
    type: REQUEST_MATCHUP_MATCHUPS,
    heroKey,
    matchupHeroKey
  };
}

function receiveMatchups (data) {
  return {
    type: RECEIVE_MATCHUP_MATCHUPS,
    data
  };
}

const defaultCommentsParams = {
  limit: 100,
  orderBy: 'score',
  order: -1
};

export const REQUEST_MATCHUP_COMMENTS = 'REQUEST_MATCHUP_COMMENTS';
export const RECEIVE_MATCHUP_COMMENTS = 'RECEIVE_MATCHUP_COMMENTS';

export function fetchCommentsIfNeeded (heroKey, matchupHeroKey, params = defaultCommentsParams) {
  return (dispatch, getState) => {
    if (shouldFetchComments(getState(), heroKey, matchupHeroKey)) {
      const root = `${CS_CHAMPION_URL}/${heroKey}/${matchupHeroKey}/comments`;
      const fullUrl = `${root}?${qs.stringify(params)}`;

      return dispatch(fetchComments(fullUrl, heroKey, matchupHeroKey));
    }
  };
}

function shouldFetchComments (state, heroKey, matchupHeroKey) {
  const {
    matchup: {
      comments
    }
  } = state;

  if (comments.isFetching)
    return false;

  // if (comments.isFetching || (heroKey === comments.heroKey && matchupHeroKey === comments.matchupHeroKey))
  //   return false;

  return true;
}

function fetchComments (url, heroKey, matchupHeroKey) {
  return dispatch => {
    dispatch(requestComments(heroKey, matchupHeroKey));

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
      .then(json => dispatch(receiveComments(json)))
      .catch (error => {
        console.log(`Request failed for ${url}: ${error.message}`);
      });
  }
}

function requestComments (heroKey, matchupHeroKey) {
  return {
    type: REQUEST_MATCHUP_COMMENTS,
    heroKey,
    matchupHeroKey
  };
}

function receiveComments (data) {
  return {
    type: RECEIVE_MATCHUP_COMMENTS,
    data
  };
}
