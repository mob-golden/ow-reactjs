import React from 'react';
import changeCase from 'change-case';

import every from 'lodash/every';
import take from 'lodash/take';
import takeRight from 'lodash/takeRight';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import CounterTips from '../tip/CounterTips';
import Loader from '../../Loader';
import { addCounterTip } from '../../../actions/all';
import { fetchCounterTipsForHero } from '../../../actions/api';

import { LANES, TYPES } from '../../../constants/types';

class HeroTips extends Component {
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

    dispatch(fetchCounterTipsForHero(heroKey));
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
      dispatch(fetchCounterTipsForHero(nextHeroKey));
    }
  }

  render () {
    const {
      children,
      heros,
      counterTips,
      isFetchingCounterTips,
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
      <div className="os-hero-tip-container">
        <div className="row">
          <div className="os-hero-tip-col">
            <div className="os-hero-tip-body">
              <span className="os-tip-hero-name">
                {changeCase.upper(heros.data[heroKey].name)} 
              </span>
              <h5 className="os-tip-title">STRATEGY & TIPS</h5>
              {!isFetchingCounterTips && counterTips ?
                <CounterTips
                  herosMap={heros.data}
                  counterTips={take(counterTips.data, 5)}
                  shouldHideMeta={true}
                />
              : <Loader />}
            </div>
          </div>
          <div className="os-hero-tip-col">
            <div className="os-hero-tip-body">
              <span className="os-tip-hero-name">
                {changeCase.upper(heros.data[heroKey].name)} 
              </span>
              <h5 className="os-tip-title">STRATEGY & TIPS</h5>
              {!isFetchingCounterTips && counterTips ?
                <CounterTips
                  herosMap={heros.data}
                  counterTips={take(counterTips.data, 5)}
                  shouldHideMeta={true}
                />
              : <Loader />}
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
      counterTips: {
        data: counterTipsData,
        isFetching: isFetchingCounterTips
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
    counterTips: counterTipsData,
    isFetchingHeros,
    isFetchingCounterTips
  };
}

export default connect(mapStateToProps)(HeroTips);
