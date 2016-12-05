import {
  combineReducers
} from 'redux';

import {
  REQUEST_MATCHUP_COMMENTS,
  RECEIVE_MATCHUP_COMMENTS,
  REQUEST_MATCHUP_COUNTER_TIPS,
  RECEIVE_MATCHUP_COUNTER_TIPS,
  REQUEST_MATCHUP_MATCHUPS,
  RECEIVE_MATCHUP_MATCHUPS
} from '../actions/matchup';

const initialState = {
  isFetching: false,
  data: null
};

function comments (state = initialState, action) {
  switch (action.type) {
    case REQUEST_MATCHUP_COMMENTS:
      return {
        ...state,
        heroKey: action.heroKey,
        isFetching: true,
        matchupHeroKey: action.matchupHeroKey
      };
    case RECEIVE_MATCHUP_COMMENTS:
      return {
        ...state,
        isFetching: false,
        data: action.data
      };
    default:
      return state;
  }
}

function counterTips (state = initialState, action) {
  switch (action.type) {
    case REQUEST_MATCHUP_COUNTER_TIPS:
      return {
        ...state,
        heroKey: action.heroKey,
        isFetching: true,
        matchupHeroKey: action.matchupHeroKey
      };
    case RECEIVE_MATCHUP_COUNTER_TIPS:
      return {
        ...state,
        isFetching: false,
        data: action.data
      };
    default:
      return state;
  }
}

function matchups (state = {}, action) {
  switch (action.type) {
    case REQUEST_MATCHUP_MATCHUPS:
      return {
        ...state,
        heroKey: action.heroKey,
        isFetching: true,
        matchupHeroKey: action.matchupHeroKey
      };
    case RECEIVE_MATCHUP_MATCHUPS:
      return {
        ...state,
        isFetching: false,
        data: action.data
      };
    default:
      return state;
  }
}

const matchup = combineReducers({
  comments,
  counterTips,
  matchups
});

export default matchup;
