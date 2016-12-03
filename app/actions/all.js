import fetch from 'isomorphic-fetch';
import qs from 'querystring';
import update from 'lodash/update';

import {
  CS_CHAMPION_URL,
  CS_COMMENTS_URL,
  CS_COUNTER_TIPS_URL
} from '../constants/urls';

// export const REQUEST_ALL_COMMENTS = 'REQUEST_ALL_COMMENTS';
// export const REQUEST_ALL_COMMENTS_SUCCESS = 'REQUEST_ALL_COMMENTS_SUCCESS';
// export const REQUEST_ALL_COMMENTS_FAILURE = 'REQUEST_ALL_COMMENTS_FAILURE';
// export const RECEIVE_ALL_COMMENTS = 'RECEIVE_ALL_COMMENTS';

// export function fetchCommentsIfNeeded (params) {
//   return (dispatch, getState) => {
//     if (shouldFetchComments(getState())) {
//       const fullUrl = `${CS_COMMENTS_URL}?${qs.stringify(params)}`;

//       return dispatch(fetchComments(fullUrl));
//     }
//   };
// }

// function shouldFetchComments (state) {
//   const {
//     all: {
//       comments
//     }
//   } = state;

//   if (comments.isFetching)
//     return false;

//   return true;
// }

// function fetchComments (url) {
//   return dispatch => {
//     dispatch(requestComments());

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
//       .then(json => dispatch(receiveComments(json)))
//       .catch (error => {
//         console.log(`Request failed for ${url}: ${error.message}`);
//       });
//   }
// }

// function requestComments () {
//   return {
//     type: REQUEST_ALL_COMMENTS
//   };
// }

// function requestCommentsSuccess () {
//   return {
//     type: REQUEST_ALL_COMMENTS_SUCCESS
//   };
// }

// function requestCommentsFailure () {
//   return {
//     type: REQUEST_ALL_COMMENTS_FAILURE
//   };
// }

// function receiveComments (data) {
//   return {
//     type: RECEIVE_ALL_COMMENTS,
//     data
//   };
// }

export const ADD_TO_ALL_COMMENTS = 'ADD_TO_ALL_COMMENTS';
export const UPVOTE_ON_ALL_COMMENTS = 'UPVOTE_ON_ALL_COMMENTS';
export const DOWNVOTE_ON_ALL_COMMENTS = 'DOWNVOTE_ON_ALL_COMMENTS';

export function addCounterTip ({
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

// export function addRootComment ({
//   authorId,
//   authorName,
//   heroKey,
//   content,
//   matchupHeroKey,
//   title,
//   token
// }) {
//   return (dispatch, getState) => {
//     const body = qs.stringify({
//       authorId,
//       authorName,
//       heroKey,
//       content,
//       matchupHeroKey,
//       title,
//       token
//     });

//     return fetch(CS_COMMENTS_URL, {
//       body,
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/x-www-form-urlencoded'
//       },
//       method: 'POST'
//     })
//       .then(response => {
//         const {
//           status,
//           statusText
//         } = response;

//         // TODO: is this necessary for a POST request?
//         if (response.status >= 200 && response.status < 300) {
//           return response;
//         } else {
//           const error = new Error(statusText);
//           console.log(`Response returned an error for ${url}: ${error.message}`);

//           return Promise.reject(error);
//         }
//       })
//       .then(response => response.json())
//       .then(json => {
//         console.log(json);
//         if (json.hasOwnProperty('error')) {
//           const error = new Error(json.error);
//           console.log(error.message);
//         } else {
//           // const comments = data.data.map(comment => {
//           //   const {
//           //     commentTree
//           //   } = comment;
//           //
//           //   return commentTree;
//           // });
//           //
//           // dispatch({
//           //   type: ADD_TO_ALL_COMMENTS,
//           //   data: update(data, `data.${constructUpdatePath(comments, parent)}.children`, children => {
//           //     if (children && children.length > 0) return [json].concat(children);
//           //     else return [json];
//           //   })
//           // });
//           //
//           return {
//             type: 'NONE'
//           };
//         }
//       })
//   };
// }

// // TODO: error handling and progress dispatches
// export function addChildComment ({
//   authorId,
//   authorName,
//   content,
//   parent,
//   root,
//   title,
//   token
// }, path) {
//   // TODO: sanitize!!! (and validate?)
//   return (dispatch, getState) => {
//     const body = qs.stringify({
//       authorId,
//       authorName,
//       content,
//       parent,
//       root,
//       title,
//       token
//     });

//     const {
//       all: {
//         comments: {
//           data
//         }
//       }
//     } = getState();

//     return fetch(CS_COMMENTS_URL, {
//       body,
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/x-www-form-urlencoded'
//       },
//       method: 'POST'
//     })
//       .then(response => {
//         const {
//           status,
//           statusText
//         } = response;

//         // TODO: is this necessary for a POST request?
//         if (response.status >= 200 && response.status < 300) {
//           return response;
//         } else {
//           const error = new Error(statusText);
//           console.log(`Response returned an error for ${url}: ${error.message}`);

//           return Promise.reject(error);
//         }
//       })
//       .then(response => response.json())
//       .then(json => {
//         if (json.hasOwnProperty('error')) {
//           const error = new Error(json.error);
//           console.log(error.message);
//         } else {
//           const comments = data.data.map(comment => {
//             const {
//               commentTree
//             } = comment;

//             return commentTree;
//           });

//           dispatch({
//             type: ADD_TO_ALL_COMMENTS,
//             data: update(data, `data.${constructUpdatePath(comments, parent)}.children`, children => {
//               if (children && children.length > 0) return [json].concat(children);
//               else return [json];
//             })
//           });
//           return {
//             type: 'NONE'
//           };
//         }
//       })
//   };
// }

// function constructUpdatePath (comments, needleId, level = 0) {
//   for (let i = 0; i < comments.length; i++) {
//     const {
//       _id: id,
//       children
//     } = comments[i];

//     let curr;
//     if (level === 0) curr = `[${i}].commentTree`;
//     else curr = `.children[${i}]`;

//     if (id === needleId) return curr;

//     if (children && children.length > 0) {
//       const next = constructUpdatePath(children, needleId, level + 1);
//       if (next) return `${curr}${next}`;
//     }
//   };

//   return null;
// }

// export function voteComment (id, downOrUp) {
//   return dispatch => {
//     return fetch(`${CS_COMMENTS_URL}/${downOrUp}/${id}`, {
//       method: 'PUT'
//     })
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
//       .then(json => {
//         return {
//           type: 'NONE'
//         };
//       });
//   }
// }

export function voteCounterTip (id, downOrUp) {
  return dispatch => {
    return fetch(`${CS_COUNTER_TIPS_URL}/${downOrUp}/${id}`, {
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

export function voteMatchup (championKey, matchupChampionKey, lane, type, downOrUp) {
  return dispatch => {
    const laneSegment = lane === 'all' ? '' : `/${lane}`;
    const url = `${CS_CHAMPION_URL}/${championKey}/${matchupChampionKey}${laneSegment}/${type}/${downOrUp}`;

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

export function invalidateCounterTips (type) {
  return {
    type
  };
}
