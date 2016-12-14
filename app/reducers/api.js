import {
  combineReducers
} from 'redux';

import {
  REQUEST_MATCHUP_TIPS,
  REQUEST_MATCHUP_TIPS_SUCCESS,
  REQUEST_MATCHUP_TIPS_FAILURE,
  RECEIVE_MATCHUP_TIPS,
  REQUEST_MATCHUPS,
  REQUEST_MATCHUPS_SUCCESS,
  REQUEST_MATCHUPS_FAILURE,
  RECEIVE_MATCHUPS,
  REQUEST_TIPS,
  REQUEST_TIPS_SUCCESS,
  REQUEST_TIPS_FAILURE,
  RECEIVE_TIPS
} from '../actions/api';

import {
  TIP_TYPES,
  MATCHUP_TYPES
} from '../constants/types';

const initializedMatchupTips = TIP_TYPES.reduce((acc, type) => {
  return {
    ...acc,
    [type]: null
  };
}, {});

const initialMatchupTipsState = {
  heroKey: null,
  matchupHeroKey: null,
  matchupTips: initializedMatchupTips,
  isFetching: false,
};

function matchupTips (state = initialMatchupTipsState, action) {
  switch (action.type) {
    case REQUEST_MATCHUP_TIPS:
      return {
        ...state,
        heroKey: action.heroKey,
        matchupHeroKey: action.matchupHeroKey,
        isFetching: true
      };
    case RECEIVE_MATCHUP_TIPS:
      const {
        matchupTips
      } = state;

      return {
        ...state,
        matchupTips: {
          ...matchupTips,
          [action.matchupTipType]: action.matchupTip
        }
      };
    case REQUEST_MATCHUP_TIPS_SUCCESS:
      return {
        ...state,
        isFetching: false
      };
    case REQUEST_MATCHUP_TIPS_FAILURE:
      return {
        ...state,
        isFetching: false
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
    case RECEIVE_MATCHUPS:
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


const initializedTips = TIP_TYPES.reduce((acc, type) => {
  return {
    ...acc,
    [type]: null
  };
}, {});

const initialTipsState = {
  heroKey: null,
  tips: initializedTips,
  isFetching: false,
};

function tips (state = initialTipsState, action) {
  switch (action.type) {
    case REQUEST_TIPS:
      return {
        ...state,
        heroKey: action.heroKey,
        isFetching: true
      };
    case RECEIVE_TIPS:
      const {
        tips
      } = state;

      return {
        ...state,
        tips: {
          ...tips,
          [action.tipType]: action.tip
        }
      };
    case REQUEST_TIPS_SUCCESS:
      return {
        ...state,
        isFetching: false
      };
    case REQUEST_TIPS_FAILURE:
      return {
        ...state,
        isFetching: false
      };
    default:
      return state;
  }
}

const api = combineReducers({
  matchupTips,
  tips,
  matchups
});

export default api;
