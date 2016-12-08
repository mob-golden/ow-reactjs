import React from 'react';
import changeCase from 'change-case';

import { toArray } from 'lodash';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import MapRankingsList from './maprankingslist';
import Loader from '../../loader';
import { fetchMatchupsForHero } from '../../../actions/api';

import { LANES, TYPES } from '../../../constants/types';

class MapRankingsPage extends Component {
  // static propTypes = {
  //   dispatch: PropTypes.func.isRequired,
  //   heroes: PropTypes.object.isRequired,
  //   counterTips: PropTypes.array.isRequired,
  //   matchups: PropTypes.array.isRequired,
  //   isFetchingHeroes: PropTypes.bool.isRequired,
  //   isFetchingCounterTips: PropTypes.bool.isRequired,
  //   isFetchingMatchups: PropTypes.bool.isRequired
  // };

  constructor (props) {
    super(props);

    // this.state = {
    //   showCounterTipsForm: false
    // };
  }

  componentDidMount () {
    // const {
    //   dispatch,
    //   token,
    //   username,
    //   userId
    // } = this.props;

    // if (!token && !username && !userId) {
    //   const localToken = localStorage.getItem('token');
    //   const localUsername = localStorage.getItem('username');
    //   const localUserId = localStorage.getItem('userId');

    //   if (localToken && localUsername && localUserId) {
    //     dispatch(setUser(localToken, localUsername, localUserId));
    //   }
    // }
  }

  componentWillMount () {
    const {
      dispatch,
      params: {
        heroKey: _heroKey
      }
    } = this.props;

    const heroKey = changeCase.lower(_heroKey);

    dispatch(fetchMatchupsForHero(heroKey));
  }

  componentWillReceiveProps (nextProps) {
    const {
      dispatch,
      params: {
        heroKey: _heroKey
      }
    } = this.props;

    const {
      params: {
        heroKey: _nextHeroKey
      }
    } = nextProps;

    const heroKey = changeCase.lower(_heroKey);
    const nextHeroKey = changeCase.lower(_nextHeroKey);

    if (heroKey !== nextHeroKey) {
      dispatch(fetchMatchupsForHero(nextHeroKey));
    }
  }

  render () {
    const {
      children,
      heroes,
      isFetchingHeroes,
      matchups,
      isFetchingMatchups,
      params: {
        heroKey: _heroKey
      },
      token
    } = this.props;

    // const {
    //   showCounterTipsForm
    // } = this.state;

    const heroKey = changeCase.lower(_heroKey);

    return (
      <div className="os-hero-maprankings-container">
        <div className="row">
          {!isFetchingMatchups && matchups.general ?
            <MapRankingsList
              heroesMap={heroes.data}
              matchups={matchups.general.counter}
              shouldHideMeta={true}
            />: <Loader />}
         
        </div>
      </div>
    );
  }
}


function mapStateToProps (state) {
  const {
    api: {
      matchups: {
        matchups: matchupsData,
        isFetching: isFetchingMatchups
      }
    },
    riot: {
      heroes: {
        data: heroesData,
        isFetching: isFetchingHeroes
      }
    }
  } = state;

  return {
    heroes: heroesData,
    matchups: matchupsData,
    isFetchingHeroes,
    isFetchingMatchups
  };
}

export default connect(mapStateToProps)(MapRankingsPage);
