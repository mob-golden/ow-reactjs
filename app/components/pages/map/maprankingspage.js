import React from 'react';
import changeCase from 'change-case';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import MapRankingsList from './maprankingslist';
import Loader from '../../loader';

import { fetchMatchupsIfNeeded } from '../../../actions/api';

class MapRankingsPage extends Component {

  constructor (props) {
    super(props);
  }

  componentDidMount () {
  }

  componentWillMount () {
    const {
      dispatch,
      params: {
        heroKey: _heroKey
      }
    } = this.props;

    const heroKey = changeCase.lower(_heroKey);

    dispatch(fetchMatchupsIfNeeded(heroKey));
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
      dispatch(fetchMatchupsIfNeeded(nextHeroKey));
    }
  }
  render () {
    const {
      children,
      mapsHash,
      isFetchingMaps,
      matchups,
      isFetchingMatchups,
      params: {
        heroKey: _heroKey
      },
      token
    } = this.props;

    if(isFetchingMatchups || !matchups.map || isFetchingMaps || !mapsHash){
      return (<Loader/>);
    }

    const heroKey = changeCase.lower(_heroKey);
    return (
      <div className="os-hero-maprankings-container">
        <div className="row">
          <MapRankingsList
            heroKey={heroKey}
            maps={mapsHash}
            matchups={matchups.map}
          />
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
    map: {
      maps: {
        _hash: mapsHash,
        isFetching: isFetchingMaps
      }
    }
  } = state;

  return {
    mapsHash,
    isFetchingMaps,
    matchups: matchupsData,
    isFetchingMatchups
  };
}

export default connect(mapStateToProps)(MapRankingsPage);
