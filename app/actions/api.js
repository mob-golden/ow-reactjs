import fetch from 'isomorphic-fetch';
import qs from 'querystring'

import {
  MATCHUP_TYPES,
  TIP_TYPES
} from '../constants/types';

import {
  OW_HERO_URL,
  OW_MAP_URL,
  OW_MATCHUPS_URL
} from '../constants/urls';

//================================HERO MATCHUP TIPS API=================================//

export const REQUEST_MATCHUP_TIPS = 'REQUEST_MATCHUP_TIPS';
export const RECEIVE_MATCHUP_TIPS = 'RECEIVE_MATCHUP_TIPS';
export const REQUEST_MATCHUP_TIPS_SUCCESS = 'REQUEST_MATCHUP_TIPS_SUCCESS';
export const REQUEST_MATCHUP_TIPS_FAILURE = 'REQUEST_MATCHUP_TIPS_SUCCESS';

export function fetchMatchupTipsIfNeeded (heroKey, matchupHeroKey, matchupType) {
  const params = {
    type: matchupType,
    sort: 'score.total-desc'
  };
  return (dispatch, getState) => {
    if (shouldFetchMatchupTips(getState(), heroKey, matchupHeroKey)) {
      const url = `${OW_MATCHUPS_URL}/${heroKey}/${matchupHeroKey}`;

      return dispatch(fetchMatchupTips(heroKey, matchupHeroKey, params));
    }
  };
}

function shouldFetchMatchupTips (state, heroKey, matchupHeroKey) {
  const {
    api: {
      matchupTips
    }
  } = state;

  // if (matchupTips.isFetching || heroKey === matchups.heroKey)
  //   return false;

  return true;
}

function fetchMatchupTips(heroKey, matchupHeroKey, params) {
  return dispatch => {
    dispatch(requestMatchupTips(heroKey, matchupHeroKey));

    Promise.all(TIP_TYPES.map(matchupTipType => {

      let root = `${OW_MATCHUPS_URL}/${heroKey}/${matchupHeroKey}`;
      if(matchupTipType == "against")
        root = `${OW_MATCHUPS_URL}/${matchupHeroKey}/${heroKey}`;

      const fullUrl = `${root}?${qs.stringify(params)}`;

      return fetch(fullUrl, {credentials : 'include',})
        .then(response => {
          const {
            status,
            statusText
          } = response;

          if (response.status >= 200 && response.status < 300) {
            return response;
          } else {
            const error = new Error(statusText);
            console.log(`Response returned an error for ${fullUrl}: ${error.message}`);

            return Promise.reject(error);
          }
        })
        .then(response => response.json())
        .then(matchupTip => dispatch(receiveMatchupTips(matchupTip, heroKey, matchupHeroKey, matchupTipType)))
        .catch(error => {
          console.log(error);
          if (error.message === 'Not Found') {
            const result = {
              data:{
                tips:[]
              },
              noMatchup: true
            };
            dispatch(receiveMatchupTips(result, heroKey, matchupHeroKey, matchupTipType));
          }
          console.log(`Response returned an error for a single matchup: ${error}`);
        });
    }))
      .then(responses => {
        dispatch(requestMatchupTipsSuccess(responses));
      })
      .catch(error => {
        console.log(`Response returned an error for fetching matchups for ${heroKey}: ${error.message}`);
        dispatch(requestMatchupTipsFailure(error));
      });
  };
}


function requestMatchupTips (heroKey, matchupHeroKey) {
  return {
    type: REQUEST_MATCHUP_TIPS,
    heroKey,
    matchupHeroKey
  };
}

function receiveMatchupTips (matchupTip, heroKey, matchupHeroKey, matchupTipType) {
  return {
    type: RECEIVE_MATCHUP_TIPS,
    heroKey,
    matchupHeroKey,
    matchupTipType,
    matchupTip
  };
}

function requestMatchupTipsSuccess (responses) {
  return {
    type: REQUEST_MATCHUP_TIPS_SUCCESS,
    responses
  };
}

function requestMatchupTipsFailure (error) {
  return {
    type: REQUEST_MATCHUP_TIPS_FAILURE,
    error
  };
}

//================================HERO MATCHUPS API=================================//

export const REQUEST_MATCHUPS = 'REQUEST_MATCHUPS';
export const REQUEST_MATCHUPS_SUCCESS = 'REQUEST_MATCHUPS_SUCCESS';
export const REQUEST_MATCHUPS_FAILURE = 'REQUEST_MATCHUPS_FAILURE';
export const RECEIVE_MATCHUPS = 'RECEIVE_MATCHUPS';


export function fetchMatchupsIfNeeded (heroKey) {
  const params = {
    sort: 'score.total-desc'
  };

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

      const typeUrlSegment = `?type=${matchupType}`;
      const root = `${OW_MATCHUPS_URL}/${heroKey}${typeUrlSegment}`;
      const fullUrl = `${root}&${qs.stringify(params)}`;

      return fetch(fullUrl, {credentials : 'include',})
        .then(response => {
          const {
            status,
            statusText
          } = response;

          if (response.status >= 200 && response.status < 300) {
            return response;
          } else {
            const error = new Error(statusText);
            console.log(`Response returned an error for ${fullUrl}: ${error.message}`);

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
    type: RECEIVE_MATCHUPS,
    heroKey,
    matchupType,
    matchup
  };
}

//================================HERO TIPS API=================================//

export const REQUEST_TIPS = 'REQUEST_TIPS';
export const REQUEST_TIPS_SUCCESS = 'REQUEST_TIPS_SUCCESS';
export const REQUEST_TIPS_FAILURE = 'REQUEST_TIPS_FAILURE';
export const RECEIVE_TIPS = 'RECEIVE_TIPS';

export function fetchTipsIfNeeded (heroKey) {
  const params = {
    sort: 'score.total-desc',
  };
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

      return fetch(fullUrl, {credentials : 'include',})
        .then(response => {
          const {
            status,
            statusText
          } = response;

          if (response.status >= 200 && response.status < 300) {
            return response;
          } else {
            const error = new Error(statusText);
            console.log(`Response returned an error for ${fullUrl}: ${error.message}`);

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


//================================MAP TIPS API=================================//

export const REQUEST_MAP_TIPS = 'REQUEST_MAP_TIPS';
export const RECEIVE_MAP_TIPS = 'RECEIVE_MAP_TIPS';

export function fetchMapTipsIfNeeded (mapKey) {
  const params = {
    sort: 'score.total-desc',
  };
  return (dispatch, getState) => {
    if (shouldFetchMapTips(getState(), mapKey))
      return dispatch(fetchMapTips(mapKey, params));
  };
}

function shouldFetchMapTips (state, mapKey) {
  const {
    api: {
      mapTips
    }
  } = state;

  if (mapTips.isFetching)
    return false;

  // if (mapTips.isFetching || mapKey === mapTips.mapKey)
  //   return false;

  return true;
}

function fetchMapTips (mapKey, params) {
  return dispatch => {
    dispatch(requestMapTips(mapKey));

    const url = `${OW_MAP_URL}/${mapKey}?${qs.stringify(params)}`;
    return fetch(url, {credentials : 'include',})
      .then(response => {
        const {
          status,
          statusText
        } = response;

        if (status >= 200 && status < 300) {
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
      .then(json => dispatch(receiveMapTips(json)))
      .catch (error => {
        console.log(`Request failed for ${url}: ${error.message}`);
      });
  }
}

function requestMapTips (mapKey) {
  return {
    type: REQUEST_MAP_TIPS,
    mapKey
  };
}

function receiveMapTips (mapTip, mapKey,) {
  return {
    type: RECEIVE_MAP_TIPS,
    mapKey,
    mapTip
  };
}



//================================MAP MATCHUP API=================================//

export const REQUEST_MAP_MATCHUPS = 'REQUEST_MAP_MATCHUPS';
export const RECEIVE_MAP_MATCHUPS = 'RECEIVE_MAP_MATCHUPS';

export function fetchMapMatchupsIfNeeded (mapKey) {
  const params = {
    sort: 'score.total-desc',
  };
  return (dispatch, getState) => {
    if (shouldFetchMapMatchups(getState(), mapKey))
      return dispatch(fetchMapMatchups(mapKey, params));
  };
}

function shouldFetchMapMatchups (state, mapKey) {
  const {
    api: {
      mapMatchups
    }
  } = state;

  if (mapMatchups.isFetching)
    return false;

  // if (mapMatchups.isFetching || mapKey === mapMatchups.mapKey)
  //   return false;

  return true;
}

function fetchMapMatchups (mapKey, params) {
  return dispatch => {
    dispatch(requestMapMatchups(mapKey));

    const url = `${OW_MATCHUPS_URL}/${mapKey}?${qs.stringify(params)}`;
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
      .then(json => dispatch(receiveMapMatchups(json)))
      .catch (error => {
        console.log(`Request failed for ${url}: ${error.message}`);
      });
  }
}

function requestMapMatchups (mapKey) {
  return {
    type: REQUEST_MAP_MATCHUPS,
    mapKey
  };
}

function receiveMapMatchups (mapMatchup, mapKey,) {
  return {
    type: RECEIVE_MAP_MATCHUPS,
    mapKey,
    mapMatchup
  };
}
