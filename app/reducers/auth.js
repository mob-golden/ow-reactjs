import {
  SET_USER,
  SIGN_IN_REQUEST,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAILURE,
  SIGN_OUT,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
  REQUEST_PASSWORD_CHANGE_REQUEST,
  REQUEST_PASSWORD_CHANGE_FAILURE,
  REQUEST_PASSWORD_CHANGE_SUCCESS,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_FAILURE,
  RESET_PASSWORD_SUCCESS,
  CHECK_SESSION_FAILURE
} from '../actions/auth';

let token = null;
let username = null;
let userId = null;

// TODO: properly check browser environment
if (typeof window !== 'undefined') {
  token = localStorage.getItem('token');
  username = localStorage.getItem('username');
  userId = localStorage.getItem('userId');
}

const initialState = {
  isPendingSignIn: false,
  isPendingSignUp: false,
  token,
  username,
  errorSignIn: null,
  errorSignUp: null,

  errorRequestPasswordChange: null,
  messageRequestPasswordChange: null,
  errorResetPassword: null,
  messageResetPassword: null,

  isRequestPasswordChangePending: false,
  isResetPasswordPending: false
};

function auth (state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        token: action.token,
        username: action.username,
        userId: action.userId
      };
    case SIGN_IN_REQUEST:
      return {
        ...state,
        isPendingSignIn: true
      };
    case SIGN_IN_SUCCESS:
      return {
        ...state,
        isPendingSignIn: false,
        token: action.token,
        username: action.username
      };
    case SIGN_IN_FAILURE:
      return {
        ...state,
        isPendingSignIn: false,
        errorSignIn: action.error
      };
    case CHECK_SESSION_FAILURE:
      return{
        ...state,
        token: null,
        username: null,
        userId: null
      }
    case SIGN_OUT:
      return {
        // empty
      };
    case SIGN_UP_REQUEST:
      return {
        ...state,
        isPendingSignUp: true
      };
    case SIGN_UP_SUCCESS:
      return {
        ...state,
        isPendingSignUp: false
      };
    case SIGN_UP_FAILURE:
      return {
        ...state,
        isPendingSignUp: false,
        errorSignUp: action.error
      };

    case REQUEST_PASSWORD_CHANGE_REQUEST:
      return {
        ...state,
        isRequestPasswordChangePending: true
      };
    case REQUEST_PASSWORD_CHANGE_FAILURE:
      return {
        ...state,
        errorPasswordChange: action.error,
        messagePasswordChange: null,
        isRequestPasswordChangePending: false
      };
    case REQUEST_PASSWORD_CHANGE_SUCCESS:
      return {
        ...state,
        errorPasswordChange: null,
        messagePasswordChange: action.message || 'Success!',
        isRequestPasswordChangePending: false
      };

    case RESET_PASSWORD_REQUEST:
      return {
        ...state,
        isResetPasswordPending: true
      };
    case RESET_PASSWORD_FAILURE:
      return {
        ...state,
        errorResetPassword: action.error,
        messageResetPassword: null,
        isResetPasswordPending: false
      };
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        errorResetPassword: null,
        messageResetPassword: action.message || 'Success!',
        isResetPasswordPending: false
      };
    default:
      return state;
  }
}


export default auth;
