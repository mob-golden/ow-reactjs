import {
  combineReducers
} from 'redux';

import {
  REQUEST_SINGLE_HERO,
  RECEIVE_SINGLE_HERO,
  REQUEST_MATCHUPS,
  REQUEST_MATCHUPS_SUCCESS,
  REQUEST_MATCHUPS_FAILURE,
  RECEIVE_MATCHUP
} from '../actions/api';

import {
  MATCHUP_TYPES
} from '../constants/types';

const initialSingleHeroState = {
  isFetching: false,
  data: null,
  shouldInvalidate: false
};

function singleHero (state = initialSingleHeroState, action) {
  switch (action.type) {
    case REQUEST_SINGLE_HERO:
      return {
        ...state,
        heroKey: action.heroKey,
        isFetching: true
      };
    case RECEIVE_SINGLE_HERO:
      return {
        ...state,
        isFetching: false,
        data: action.data
      };
    case 'INVALIDATE_SINGLE_HERO':
      return {
        ...state,
        shouldInvalidate: true
      };
    default:
      return state;
  }
}

const initializedMatchups = MATCHUP_TYPES.reduce((acc, type) => {
  return {
    ...acc,
    [type]: null
  };
}, {});

const initialMatchupsState = {
  heroKey: null,
  matchups: initializedMatchups,
  isFetching: false,
};

function matchups (state = initialMatchupsState, action) {
  switch (action.type) {
    case REQUEST_MATCHUPS:
      return {
        ...state,
        heroKey: action.heroKey,
        isFetching: true
      };
    case RECEIVE_MATCHUP:
      const {
        matchups
      } = state;

      return {
        ...state,
        matchups: {
          ...matchups,
          [action.matchupType]: action.matchup
        }
      };
    case REQUEST_MATCHUPS_SUCCESS:
      return {
        ...state,
        isFetching: false
      };
    case REQUEST_MATCHUPS_FAILURE:
      return {
        ...state,
        isFetching: false
      };
    default:
      return state;
  }
}

const api = combineReducers({
  singleHero,
  matchups
});

export default api;
