import fetch from 'isomorphic-fetch';
import qs from 'querystring'

import {
  MATCHUP_TYPES,
  TIP_TYPES
} from '../constants/types';

import {
  OW_HERO_URL,
  OW_MATCHUPS_URL
} from '../constants/urls';

// export const REQUEST_MATCHUP_TIPS = 'REQUEST_MATCHUP_TIPS';
// export const RECEIVE_MATCHUP_TIPS = 'RECEIVE_MATCHUP_TIPS';

// export function fetchMatchupTipsIfNeeded (heroKey, matchupHeroKey, params) {
//   return (dispatch, getState) => {
//     if (shouldFetchMatchupTips(getState(), heroKey, matchupHeroKey)) {
//       const url = `${CS_TIPS_URL}?${qs.stringify(params)}`;

//       return dispatch(fetchMatchupTips(url));
//     }
//   };
// }

// function shouldFetchMatchupTips (state, heroKey, matchupHeroKey) {
//   const {
//     api: {
//       matchupTips
//     }
//   } = state;

//   if (matchupTips.isFetching)
//     return false;

//   return true;
// }

// function fetchMatchupTips (url, heroKey, matchupHeroKey) {
//   return dispatch => {
//     dispatch(requestMatchupTips(heroKey, matchupHeroKey));

//     return fetch(url)
//       .then(response => {
//         const {
//           status,
//           statusText
//         } = response;

//         if (status >= 200 && status < 300) {
//           return response;
//         } else {
//           const error = new Error(statusText);
//           console.log(`Response returned an error for ${url}: ${error.message}`);

//           return Promise.reject(error);
//         }
//       })
//       .then(response => response.json())
//       .then(json => dispatch(receiveMatchupTips(json)))
//       .catch (error => {
//         console.log(`Request failed for ${url}: ${error.message}`);
//       });
//   }
// }

// function requestMatchupTips (heroKey, matchupHeroKey) {
//   return {
//     type: REQUEST_MATCHUP_TIPS,
//     heroKey,
//     matchupHeroKey
//   };
// }

// function receiveMatchupTips (data) {
//   return {
//     type: RECEIVE_MATCHUP_TIPS,
//     data
//   };
// }

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



export const REQUEST_TIPS = 'REQUEST_TIPS';
export const REQUEST_TIPS_SUCCESS = 'REQUEST_TIPS_SUCCESS';
export const REQUEST_TIPS_FAILURE = 'REQUEST_TIPS_FAILURE';
export const RECEIVE_TIPS = 'RECEIVE_TIPS';

export function fetchTipsForHero(heroKey) {
  return dispatch => {
    const params = {
      // 50 is the max limit
      //limit: 50,
      sort: 'score.total-desc',
      //order: -1,
      //page: 1
    };

    return dispatch(fetchTipsIfNeeded(heroKey, params));
  };
}

export function fetchTipsIfNeeded (heroKey, params) {
  return (dispatch, getState) => {
    if (shouldFetchTips(getState(), heroKey))
      return dispatch(fetchTips(heroKey, params));
  };
}

function shouldFetchTips (state, heroKey) {
  const {
    api: {
      tips
    }
  } = state;

  if (tips.isFetching)
    return false;

  // if (tips.isFetching || heroKey === tips.heroKey)
  //   return false;

  return true;
}

function fetchTips (heroKey, params) {
  return dispatch => {
    dispatch(requestTips(heroKey));

    Promise.all(TIP_TYPES.map(tipType => {

      // `/tips/:heroKey` returns tips from all types
      const typeUrlSegment = `?filter=${tipType}`;
      const root = `${OW_HERO_URL}/${heroKey}${typeUrlSegment}`;
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
        .then(tip => dispatch(receiveTips(tip, heroKey, tipType)))
    }))
      .then(responses => {
        dispatch(requestTipsSuccess(responses));
      })
      .catch(error => {
        console.log(`Response returned an error for fetching tips for ${heroKey}: ${error.message}`);
        dispatch(requestTipsFailure(error));
      });
  };
}

function requestTips (heroKey) {
  return {
    type: REQUEST_TIPS,
    heroKey
  };
}

function requestTipsSuccess (responses) {
  return {
    type: REQUEST_TIPS_SUCCESS,
    responses
  };
}

function requestTipsFailure (error) {
  return {
    type: REQUEST_TIPS_FAILURE,
    error
  };
}

function receiveTips (tip, heroKey, tipType) {
  return {
    type: RECEIVE_TIPS,
    heroKey,
    tipType,
    tip
  };
}