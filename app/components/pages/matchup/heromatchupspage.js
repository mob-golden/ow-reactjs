import React from 'react';
import changeCase from 'change-case';

import { toArray } from 'lodash';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import HeroMatchupsList from './heromatchupslist';
import Loader from '../../loader';
import { fetchMatchupsForHero } from '../../../actions/api';

import { LANES, TYPES } from '../../../constants/types';

class HeroMatchupsPage extends Component {
  // static propTypes = {
  //   dispatch: PropTypes.func.isRequired,
  //   heros: PropTypes.object.isRequired,
  //   counterTips: PropTypes.array.isRequired,
  //   matchups: PropTypes.array.isRequired,
  //   isFetchingHeros: PropTypes.bool.isRequired,
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
      heros,
      isFetchingHeros,
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
      <div className="os-hero-matchups-container">
        <div className="row">
          <div className="os-hero-matchups-col">
            <div className="os-hero-matchups-body">
              <span className="os-matchups-hero-name">
                {changeCase.upper(heros.data[heroKey].name)} 
              </span>
              <h5 className="os-matchups-title">COUNTERS</h5>
              {!isFetchingMatchups && matchups.general ?
                <HeroMatchupsList
                  herosMap={heros.data}
                  matchups={matchups.general.counter}
                  shouldHideMeta={true}
                />: <Loader />}
              <div className="row">
                <div className="col-lg-12 center-text"> 
                  <a href="#" className="btn btn-default os-btn-white">VIEW ALL</a>
                </div>
              </div>
            </div>
          </div>
          <div className="os-hero-matchups-col">
            <div className="os-hero-matchups-body">
              
            </div>
          </div>
          <div className="os-hero-matchups-col">
            <div className="os-hero-matchups-body">
              
            </div>
          </div>
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
      heros: {
        data: herosData,
        isFetching: isFetchingHeros
      }
    }
  } = state;

  return {
    heros: herosData,
    matchups: matchupsData,
    isFetchingHeros,
    isFetchingMatchups
  };
}

export default connect(mapStateToProps)(HeroMatchupsPage);
