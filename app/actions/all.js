import fetch from 'isomorphic-fetch';
import qs from 'querystring';

import {
  OW_TIPS_URL,
  OW_MATCHUPS_URL,
  OW_HERO_URL,
  OW_MAP_URL,
  OW_COMMUNITY_URL
} from '../constants/urls';

import {
  fetchTipsIfNeeded,
  fetchMatchupsIfNeeded,
  fetchMatchupTipsIfNeeded,
  fetchMapTipsIfNeeded
} from './api';

import {
  fetchThreadsIfNeeded,
  fetchSingleThreadIfNeeded
} from './community';

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
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      credentials : 'include',
      method: 'PUT'
    })
      .then(response => {
        const {
          status,
          statusText
        } = response;

        // TODO: is this necessary for a POST request?
        if (response.status >= 200 && response.status < 300) {
          // dispatch(fetchTipsIfNeeded(heroKey));
          return response;
        } else {
          const error = new Error(statusText);
          console.log(`Response returned an error for ${url}: ${error.message}`);
          return Promise.reject(error);
        }
      })
      .then(response => response.json())
      .then(error => console.log(error));
  };
}

export function deleteHeroTip ({
  id,
  token,
  masterKey
}) {
  return (dispatch, getState) => {

    return fetch(`${OW_TIPS_URL}/${masterKey}/${id}`, {
      credentials : 'include',
      method: 'DELETE'
    })
      .then(response => {
        const {
          status,
          statusText
        } = response;

        // TODO: is this necessary for a POST request?
        if (response.status >= 200 && response.status < 300) {
          return response;
        } else {
          const error = new Error(statusText);
          console.log(`Response returned an error for ${url}: ${error.message}`);
          return Promise.reject(error);
        }
      });
  };
}


export function editHeroTip ({
  id,
  content,
  token,
  masterKey
}) {
  return (dispatch, getState) => {

    const body = qs.stringify({
      content
    });

    return fetch(`${OW_TIPS_URL}/${masterKey}/${id}`, {
      body,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      credentials : 'include',
      method: 'POST'
    })
      .then(response => {
        const {
          status,
          statusText
        } = response;

        // TODO: is this necessary for a POST request?
        if (response.status >= 200 && response.status < 300) {
          return response;
        } else {
          const error = new Error(statusText);
          console.log(`Response returned an error for ${url}: ${error.message}`);
          return Promise.reject(error);
        }
      });
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
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      credentials : 'include',
      method: 'PUT'
    })
      .then(response => {
        const {
          status,
          statusText
        } = response;

        // TODO: is this necessary for a POST request?
        if (response.status >= 200 && response.status < 300) {
          // dispatch(fetchMatchupsIfNeeded(heroKey)); // Don't need this because of cache
          return response;
        } else {
          const error = new Error(statusText);
          console.log(`Response returned an error for ${url}: ${error.message}`);

          return Promise.reject(error);
        }
      });
  };
}


// direction => true : Add a tip for left hero (DEFAULT)
// direction => false : Add a tip for right hero
export function addHeroMatchupTip ({
  heroKey,
  matchupKey,
  content,
  tipType,
  token,
  direction = true
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
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      credentials : 'include',
      method: 'PUT'
    })
      .then(response => {
        const {
          status,
          statusText
        } = response;

        // TODO: is this necessary for a POST request?
        if (response.status >= 200 && response.status < 300) {
          // if(direction)
          //   dispatch(fetchMatchupTipsIfNeeded(heroKey, matchupKey, tipType));
          // else
          //   dispatch(fetchMatchupTipsIfNeeded(matchupKey, heroKey, tipType));
          return response;
        } else {
          const error = new Error(statusText);
          console.log(`Response returned an error for ${url}: ${error.message}`);

          return Promise.reject(error);
        }
      })
      .then(response => response.json())
      .then(error => console.log(error));
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
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      credentials : 'include',
      method: 'PUT'
    })
      .then(response => {
        const {
          status,
          statusText
        } = response;

        // TODO: is this necessary for a POST request?
        if (response.status >= 200 && response.status < 300) {
          // dispatch(fetchMapTipsIfNeeded(mapKey)); 
          return response;
        } else {
          const error = new Error(statusText);
          console.log(`Response returned an error for ${url}: ${error.message}`);
          return Promise.reject(error);
        }
      })
      .then(response => response.json())
      .then(error => console.log(error));
  };
}


export function voteTip (id, downOrUp, masterKey) {
  return dispatch => {
    return fetch(`${OW_TIPS_URL}/${masterKey}/${id}/${downOrUp}`, {
      method: 'PUT',
      credentials : 'include',
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
      .then(error => console.log(error));
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
      credentials : 'include',
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
      .then(error => console.log(error));
  }
}


//=================================Community POST/PUT/DELETE api ==============================

export function addThread ({
  type,
  topic,
  content,
  userId,
  userName,
  token
}) {
  return (dispatch, getState) => {
    const body = JSON.stringify({
      author: {
        id: userId,
        name: userName,
        anonymous: false
      },
      title: topic,
      views: 0,
      class: ["overwatchselect", type],
      content: content
    });

    return fetch(`${OW_COMMUNITY_URL}/item`, {
      body,
      headers: {
        'Content-Type': 'application/json'
      },
      credentials : 'include',
      method: 'POST'
    })
      .then(response => {
        const {
          status,
          statusText
        } = response;

        // TODO: is this necessary for a POST request?
        if (response.status >= 200 && response.status < 300) {
          dispatch(fetchThreadsIfNeeded(type));
          return response;
        } else {
          const error = new Error(statusText);
          console.log(`Response returned an error for ${url}: ${error.message}`);

          return Promise.reject(error);
        }
      })
      .then(response => response.json())
      .then(error => console.log(error));
  };
}


export function addComment ({
  type,
  threadId,
  content,
  userId,
  userName,
  token
}) {
  return (dispatch, getState) => {
    const body = JSON.stringify({
      author: {
        id: userId,
        name: userName,
        anonymous: false
      },
      views: 0,
      class: ["overwatchselect", type],
      parent: threadId,
      content: content
    });

    return fetch(`${OW_COMMUNITY_URL}/item`, {
      body,
      headers: {
        'Content-Type': 'application/json'
      },
      credentials : 'include',
      method: 'POST'
    })
      .then(response => {
        const {
          status,
          statusText
        } = response;

        // TODO: is this necessary for a POST request?
        if (response.status >= 200 && response.status < 300) {
          dispatch(fetchSingleThreadIfNeeded(threadId));
          return response;
        } else {
          const error = new Error(statusText);
          console.log(`Response returned an error for ${url}: ${error.message}`);

          return Promise.reject(error);
        }
      })
      .then(response => response.json())
      .then(error => console.log(error));
  };
}

export function voteComment (id, downOrUp) {
  return dispatch => {
    return fetch(`${OW_COMMUNITY_URL}/${downOrUp}/${id}`, {
      method: 'PUT',
      credentials : 'include'
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
          console.log(`Response returned an ${error.message}`);

          return Promise.reject(error);
        }
      })
      .then(response => response.json())
      .then(error => console.log(error));
  }
}

export function deleteCommunityComment ({
  id,
  token
}) {
  return (dispatch, getState) => {

    return fetch(`${OW_COMMUNITY_URL}/item/${id}`, {
      headers: {
        'Authorization': token
      },
      method: 'DELETE'
    })
      .then(response => {
        const {
          status,
          statusText
        } = response;

        // TODO: is this necessary for a POST request?
        if (response.status >= 200 && response.status < 300) {
          return response;
        } else {
          const error = new Error(statusText);
          console.log(`Response returned an error for ${url}: ${error.message}`);
          return Promise.reject(error);
        }
      });
  };
}


export function editCommunityComment ({
  id,
  content,
  token
}) {
  return (dispatch, getState) => {

    const body = qs.stringify({
      content
    });

    return fetch(`${OW_COMMUNITY_URL}/item/${id}`, {
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
          return response;
        } else {
          const error = new Error(statusText);
          console.log(`Response returned an error for ${url}: ${error.message}`);
          return Promise.reject(error);
        }
      });
  };
}