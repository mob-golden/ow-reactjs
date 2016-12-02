import React from 'react';
import changeCase from 'change-case';
import take from 'lodash/take';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CounterTips from '../tip/countertips';
import Loader from '../../loader';
import { fetchCounterTipsForHero } from '../../../actions/api';

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
              <div className="row">
                <div className="col-lg-3">
                  <a href="#" className="btn btn-primary os-btn-addtip">ADD A TIP</a>
                </div>
                <div className="col-lg-3"> 
                  <a href="#" className="btn btn-default os-btn-viewall">VIEW ALL</a>
                </div>
              </div>
            </div>
          </div>
          <div className="os-hero-tip-col">
            <div className="os-hero-tip-body">
              {/* TODO HERE */}
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
