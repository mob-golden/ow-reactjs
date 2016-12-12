import fetch from 'isomorphic-fetch';
import qs from 'querystring';
import update from 'lodash/update';

import {
  OW_TIPS_URL,
  OW_MATCHUPS_URL,
  CS_COUNTER_TIPS_URL
} from '../constants/urls';

export const ADD_TO_ALL_COMMENTS = 'ADD_TO_ALL_COMMENTS';
export const UPVOTE_ON_ALL_COMMENTS = 'UPVOTE_ON_ALL_COMMENTS';
export const DOWNVOTE_ON_ALL_COMMENTS = 'DOWNVOTE_ON_ALL_COMMENTS';

export function addTip ({
  authorId,
  authorName,
  heroKey,
  content,
  matchupHeroKey,
  token
}) {
  return (dispatch, getState) => {
    const body = qs.stringify({
      authorId,
      authorName,
      heroKey,
      content,
      matchupHeroKey,
      token
    });

    console.log(body);

    return fetch(CS_COUNTER_TIPS_URL, {
      body,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
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
      })
      .then(response => response.json())
      .then(json => {
        console.log(json);
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

export function voteMatchup (heroKey, matchupHeroKey, downOrUp) {
  return dispatch => {
    
    const url = `${OW_MATCHUPS_URL}/${heroKey}/${matchupHeroKey}/${downOrUp}`;

    return fetch(url, {
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
