import fetch from 'isomorphic-fetch';
import qs from 'querystring';

import {
  OW_TIPS_URL,
  OW_MATCHUPS_URL,
  OW_HERO_URL,
  OW_MAP_URL
} from '../constants/urls';

import {
  fetchTipsIfNeeded,
  fetchMatchupsIfNeeded,
  fetchMatchupTipsIfNeeded,
  fetchMapTipsIfNeeded
} from './api';

export function addHeroTip ({
  heroKey,
  content,
  tipType,
  token
}) {
  return (dispatch, getState) => {
    const body = qs.stringify({
      content,
      type:tipType
    });

    return fetch(`${OW_HERO_URL}/${heroKey}/tips`, {
      body,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': token
      },
      method: 'PUT'
    })
      .then(response => {
        const {
          status,
          statusText
        } = response;

        // TODO: is this necessary for a POST request?
        if (response.status >= 200 && response.status < 300) {
          dispatch(fetchTipsIfNeeded(heroKey));
          return response;
        } else {
          const error = new Error(statusText);
          console.log(`Response returned an error for ${url}: ${error.message}`);
          return Promise.reject(error);
        }
      })
      .then(response => response.json())
      .then(json => {
        // console.log(json);
        if (json.hasOwnProperty('error')) {
          const error = new Error(json.error);
          console.log(error.message);
        } else {
        }
      })
  };
}

export function addHeroMatchup ({
  heroKey,
  matchupKey,
  type,
  token
}) {
  return (dispatch, getState) => {
    const body = qs.stringify({
      opponentId: matchupKey,
      type
    });

    return fetch(`${OW_MATCHUPS_URL}/${heroKey}`, {
      body,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': token
      },
      method: 'PUT'
    })
      .then(response => {
        const {
          status,
          statusText
        } = response;

        // TODO: is this necessary for a POST request?
        if (response.status >= 200 && response.status < 300) {
          dispatch(fetchMatchupsIfNeeded(heroKey));
          return response;
        } else {
          const error = new Error(statusText);
          console.log(`Response returned an error for ${url}: ${error.message}`);

          return Promise.reject(error);
        }
      })
      .then(response => response.json())
      .then(json => {
        // console.log(json);
        if (json.hasOwnProperty('error')) {
          const error = new Error(json.error);
          console.log(error.message);
        } else {
        }
      })
  };
}


export function addHeroMatchupTip ({
  heroKey,
  matchupKey,
  content,
  tipType,
  token
}) {
  return (dispatch, getState) => {
    const body = qs.stringify({
      content,
      type:tipType
    });

    return fetch(`${OW_MATCHUPS_URL}/${heroKey}/${matchupKey}/tip`, {
      body,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': token
      },
      method: 'PUT'
    })
      .then(response => {
        const {
          status,
          statusText
        } = response;

        // TODO: is this necessary for a POST request?
        if (response.status >= 200 && response.status < 300) {
          dispatch(fetchMatchupTipsIfNeeded(heroKey, matchupKey, tipType));
          return response;
        } else {
          const error = new Error(statusText);
          console.log(`Response returned an error for ${url}: ${error.message}`);

          return Promise.reject(error);
        }
      })
      .then(response => response.json())
      .then(json => {
        // console.log(json);
        if (json.hasOwnProperty('error')) {
          const error = new Error(json.error);
          console.log(error.message);
        } else {
        }
      })
  };
}

export function addMapTip ({
  mapKey,
  content,
  token
}) {
  return (dispatch, getState) => {
    const body = qs.stringify({
      content
    });

    return fetch(`${OW_MAP_URL}/${mapKey}/tips`, {
      body,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': token
      },
      method: 'PUT'
    })
      .then(response => {
        const {
          status,
          statusText
        } = response;

        // TODO: is this necessary for a POST request?
        if (response.status >= 200 && response.status < 300) {
          dispatch(fetchMapTipsIfNeeded(mapKey));
          return response;
        } else {
          const error = new Error(statusText);
          console.log(`Response returned an error for ${url}: ${error.message}`);
          return Promise.reject(error);
        }
      })
      .then(response => response.json())
      .then(json => {
        // console.log(json);
        if (json.hasOwnProperty('error')) {
          const error = new Error(json.error);
          console.log(error.message);
        } else {
        }
      })
  };
}


export function voteTip (id, downOrUp) {
  return dispatch => {
    return fetch(`${OW_TIPS_URL}/${id}/${downOrUp}`, {
      method: 'PUT'
    })
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
      .then(json => {
        return {
          type: 'NONE'
        };
      });
  }
}

export function voteMatchup (heroKey, matchupHeroKey, downOrUp, matchupType) {
  return dispatch => {
    
    const url = `${OW_MATCHUPS_URL}/${heroKey}/${matchupHeroKey}/${downOrUp}`;
    const body = qs.stringify({   type:matchupType });
    return fetch(url, {
      body,      
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'PUT'
    })
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
      .then(json => {
        return {
          type: 'NONE'
        };
      });
  }
}

export function invalidateTips (type) {
  return {
    type
  };
}
