import React from 'react';
import changeCase from 'change-case';

import { toArray } from 'lodash';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import HeroMatchupsList from './heromatchupslist';
import Loader from '../../loader';
import { fetchMatchupsForHero } from '../../../actions/api';

class HeroMatchupsPage extends Component {


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
    if(!isFetchingMatchups && matchups.positive){
      const heroName = changeCase.upper(matchups.positive.data.name);
      return (
        <div className="os-hero-matchups-container">
          <div className="row">
            <div className="os-hero-matchups-col">
              <div className="os-hero-matchups-body">
                <span className="os-matchups-hero-name">
                  {heroName}  
                </span>
                <h5 className="os-matchups-title">COUNTERS</h5>
                
                  <HeroMatchupsList
                    heroKey={heroKey}
                    matchups={matchups.positive}
                  />
                <div className="row">
                  <div className="col-lg-12 center-text"> 
                    <a href="#" className="btn btn-secondary os-btn-white">VIEW ALL</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="os-hero-matchups-col">
              <div className="os-hero-matchups-body">
                <span className="os-matchups-hero-name">
                  {heroName}  
                </span>
                <h5 className="os-matchups-title">COUNTERED BY</h5>
                
                  <HeroMatchupsList
                    heroKey={heroKey}
                    matchups={matchups.negative}
                  />
                <div className="row">
                  <div className="col-lg-12 center-text"> 
                    <a href="#" className="btn btn-secondary os-btn-white">VIEW ALL</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="os-hero-matchups-col">
              <div className="os-hero-matchups-body">
                <span className="os-matchups-hero-name">
                  {heroName}  
                </span>
                <h5 className="os-matchups-title">TEAM WITH</h5>
                
                  <HeroMatchupsList
                    heroKey={heroKey}
                    matchups={matchups.teamup}
                  />
                <div className="row">
                  <div className="col-lg-12 center-text"> 
                    <a href="#" className="btn btn-secondary os-btn-white">VIEW ALL</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    else{
      return (<Loader/>);
    }
  }
}


function mapStateToProps (state) {
  const {
    api: {
      matchups: {
        matchups: matchupsData,
        isFetching: isFetchingMatchups
      }
    }
  } = state;

  return {
    matchups: matchupsData,
    isFetchingMatchups
  };
}

export default connect(mapStateToProps)(HeroMatchupsPage);
