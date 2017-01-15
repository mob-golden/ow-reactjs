import fetch from 'isomorphic-fetch';
import qs from 'querystring';

export const SET_USER = 'SET_USER';
export const SIGN_IN_REQUEST = 'SIGN_IN_REQUEST';
export const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS';
export const SIGN_IN_FAILURE = 'SIGN_IN_FAILURE';
export const SIGN_OUT = 'SIGN_OUT';
export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';
export const REQUEST_PASSWORD_CHANGE_REQUEST = 'REQUEST_PASSWORD_CHANGE_REQUEST';
export const REQUEST_PASSWORD_CHANGE_SUCCESS = 'REQUEST_PASSWORD_CHANGE_SUCCESS';
export const REQUEST_PASSWORD_CHANGE_FAILURE = 'REQUEST_PASSWORD_CHANGE_FAILURE';
export const RESET_PASSWORD_REQUEST = 'RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_FAILURE = 'RESET_PASSWORD_FAILURE';
export const CHECK_SESSION_FAILURE = 'CHECK_SESSION_FAILURE';


const SIGN_IN_URL = '/signin';
const SIGN_UP_URL = '/signup';
const SIGN_OUT_URL = '/signout'; 
const CHECK_SESSION_URL = '/checkSession';
const FORGOT_PASSWORD_URL = '/forgot';
const RESET_PASSWORD_URL = '/reset';

function deleteAllCookies() {
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 00:00:00 GMT";
  }
}

export function setUser (token, username, userId) {
  return {
    type: SET_USER,
    token,
    username,
    userId
  };
}

export function signIn (email, password) {
  return dispatch => {
    dispatch(signInRequest());
    const data = qs.stringify({
      email,
      password,
    });

    return fetch(SIGN_IN_URL, {
      body: data,
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

        if (response.status >= 200 && response.status < 300) {
          return response;
        } else {
          const error = new Error(statusText);
          console.log(`Response returned an error for ${url}: ${error.message}`);

          dispatch(signInFailure(error));

          return Promise.reject(error);
        }
      })
      .then(response => response.json())
      .then(json => {
        if (json.hasOwnProperty('error')) {
          const error = new Error(json.error);
          dispatch(signInFailure(error));
        } else {
          const {
            access_token: token,
            groups,
            user: {
              // email,
              id: userId,
              username
            }
          } = json;

          localStorage.setItem('token', token);
          localStorage.setItem('username', username);
          localStorage.setItem('userId', userId);
          localStorage.setItem('userIsAdmin', groups.indexOf('tsmAdmins') > -1 );

          // TODO: return?
          dispatch(signInSuccess({token, username}));
        }
      })
  };
}

function signInRequest () {
  return {
    type: SIGN_IN_REQUEST
  };
}

// TODO: normalize function parameters
function signInSuccess ({token, username}) {
  return {
    type: SIGN_IN_SUCCESS,
    token,
    username
  };
}

function signInFailure (error) {
  return {
    type: SIGN_IN_FAILURE,
    error
  };
}

export function signOut () {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('userId');
  localStorage.removeItem('userIsAdmin');

  deleteAllCookies();
  fetch(SIGN_OUT_URL,{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    credentials : 'include',
    method: 'POST'
  });
  return {
    type: SIGN_OUT
  };
}

export function signUp (email, password, username) {
  return dispatch => {
    dispatch(signUpRequest());

    const data = qs.stringify({
      email,
      password,
      username
    });

    return fetch(SIGN_UP_URL, {
      body: data,
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

        if (response.status >= 200 && response.status < 300) {
          return response;
        } else {
          const error = new Error(statusText);
          console.log(`Response returned an error for ${url}: ${error.message}`);

          dispatch(signUpFailure(error));

          return Promise.reject(error);
        }
      })
      .then(response => response.json())
      .then(json => {
        if (json.hasOwnProperty('error')) {
          const error = new Error(json.error);
          dispatch(signUpFailure(error));
        } else {
          dispatch(signUpSuccess())
          dispatch(signIn(email, password));
        }
      })
  };
}

function signUpRequest () {
  return {
    type: SIGN_UP_REQUEST
  };
}

function signUpSuccess () {
  return {
    type: SIGN_UP_SUCCESS
  };
}

function signUpFailure (error) {
  return {
    type: SIGN_UP_FAILURE,
    error
  };
}

function requestPasswordChangeRequest () {
  return {
    type: REQUEST_PASSWORD_CHANGE_REQUEST
  };
}

function requestPasswordChangeFailure (error) {
  return {
    type: REQUEST_PASSWORD_CHANGE_FAILURE,
    error
  };
}

function requestPasswordChangeSuccess (message) {
  return {
    type: REQUEST_PASSWORD_CHANGE_SUCCESS,
    message: 'Please check your email for further instructions.'
  };
}

export function requestPasswordChange (email) {
  return dispatch => {
    dispatch(requestPasswordChangeRequest());

    const data = qs.stringify({
      email
    });

    const url = FORGOT_PASSWORD_URL;

    return fetch(url, {
      body: data,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      credentials : 'include'
    })
      .then(response => {
        console.log('then');
        const {
          status,
          statusText
        } = response;

        if (response.status >= 200 && response.status < 300) {
          return response;
        } else {
          const error = new Error(statusText);
          // console.log(`Response returned an error for ${url}: ${error.message}`);

          dispatch(requestPasswordChangeFailure(error));

          return Promise.reject(error);
        }
      })
      .then(response => response.json())
      .then(json => {
        // NOTE: json.error here is the success message
        return dispatch(requestPasswordChangeSuccess(json.error));
      })
      .catch(error => {
        return dispatch(requestPasswordChangeFailure(error));
      })
  };
}

function resetPasswordRequest () {
  return {
    type: RESET_PASSWORD_REQUEST
  };
}

function resetPasswordFailure (error) {
  return {
    type: RESET_PASSWORD_FAILURE,
    error
  };
}

function resetPasswordSuccess (message) {
  return {
    type: RESET_PASSWORD_SUCCESS,
    message: 'Your password has been reset.'
  };
}

export function resetPassword (token, userId, password) {
  return dispatch => {
    dispatch(resetPasswordRequest());

    const data = qs.stringify({
      password,
      token,
      userId
    });

    return fetch(RESET_PASSWORD_URL, {
      body: data,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      credentials : 'include'
    })
      .then(response => {
        const {
          status,
          statusText
        } = response;

        if (response.status >= 200 && response.status < 300) {
          return response;
        } else {
          const error = new Error(statusText);
          // console.log(`Response returned an error for ${url}: ${error.message}`);

          dispatch(resetPasswordFailure(error));

          return Promise.reject(error);
        }
      })
      .then(response => response.json())
      .then(json => {
        return dispatch(resetPasswordSuccess(json.error));
      })
  };
}

// =========================== CHECK SESSION ===============================

export function checkSession () {
  return dispatch => {
    return fetch(CHECK_SESSION_URL,{
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      credentials : 'include',
      method: 'GET'
    })
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

          dispatch(checkSessionFailure(error));

          return Promise.reject(error);
        }
      })
      .then(response => response.json())
      .then(json => {
        if (json.hasOwnProperty('error')) {
          const error = new Error(json.error);
          dispatch(checkSessionFailure(error));
        } else {
          const {
            isLoggedIn
          } = json;
          if(!isLoggedIn){
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('userId');
            deleteAllCookies();
            dispatch(checkSessionFailure());
          }
        }
      })
  };
}

function checkSessionFailure (error) {
  return {
    type: CHECK_SESSION_FAILURE
  };
}

