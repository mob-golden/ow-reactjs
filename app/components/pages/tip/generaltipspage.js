import React from 'react';
import changeCase from 'change-case';
import take from 'lodash/take';
import { Link } from 'react-router';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import TipsList from './tipslist';
import Loader from '../../loader';
import { fetchCounterTipsForHero } from '../../../actions/api';

class GeneralTipsPage extends Component {
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
      heroes,
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
              <span className="os-hero-tip-name">
                {changeCase.upper(heroes.data[heroKey].name)} 
              </span>
              <h5 className="os-hero-tip-title">STRATEGY & TIPS</h5>
              {!isFetchingCounterTips && counterTips ?
                <TipsList
                  counterTips={take(counterTips.data, 5)}
                  shouldHideMeta={true}
                />
              : <Loader />}
              <div className="row">
                <div className="col-lg-3">
                  <Link
                    className="btn btn-primary os-btn-blue"
                    to={`/heroes/${heroKey}/strategytips`}
                  >
                  ADD A TIP
                  </Link>
                </div>
                <div className="col-lg-3"> 
                  <Link
                    className="btn btn-secondary os-btn-white"
                    to={`/heroes/${heroKey}/strategytips`}
                  >
                  VIEW ALL
                  </Link>
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
      heroes: {
        data: heroesData,
        isFetching: isFetchingHeroes
      }
    }
  } = state;

  return {
    heroes: heroesData,
    counterTips: counterTipsData,
    isFetchingHeroes,
    isFetchingCounterTips
  };
}

export default connect(mapStateToProps)(GeneralTipsPage);
