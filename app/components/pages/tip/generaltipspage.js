import React from 'react';
import changeCase from 'change-case';
import take from 'lodash/take';
import { Link } from 'react-router';
import { Component, PropTypes } from 'react';
import { findIndex } from 'lodash';
import { connect } from 'react-redux';
import TipsList from './tipslist';
import Loader from '../../loader';
import { fetchSingleHero } from '../../../actions/api';

class GeneralTipsPage extends Component {
  // static propTypes = {
  //   dispatch: PropTypes.func.isRequired,
  //   heroes: PropTypes.object.isRequired,
  //   tips: PropTypes.array.isRequired,
  //   matchups: PropTypes.array.isRequired,
  //   isFetchingHeroes: PropTypes.bool.isRequired,
  //   isFetchingSingleHero: PropTypes.bool.isRequired,
  //   isFetchingMatchups: PropTypes.bool.isRequired
  // };

  constructor (props) {
    super(props);

    // this.state = {
    //   showTipsForm: false
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

    dispatch(fetchSingleHero(heroKey));
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
      dispatch(fetchSingleHero(nextHeroKey));
    }
  }

  render () {
    const {
      children,
      params:{
        heroKey: _heroKey
      },
      singleHero,
      isFetchingSingleHero
    } = this.props;

    if(isFetchingSingleHero || !singleHero){
      return (<Loader />);
    }

    const heroKey = changeCase.lower(_heroKey);
    // const {
    //   showTipsForm
    // } = this.state;

    return (
      <div className="os-hero-tip-container">
        <div className="row">
          <div className="os-hero-tip-col">
            <div className="os-hero-tip-body">
              <span className="os-hero-tip-name">
                {changeCase.upper(singleHero.data.name)} 
              </span>
              <h5 className="os-hero-tip-title">STRATEGY & TIPS</h5>
              { 
                <TipsList
                  tips={take(singleHero.data.tips, 5)}
                  shouldHideMeta={true}
                />
              }
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
      singleHero: {
        data: singleHeroData,
        isFetching: isFetchingSingleHero
      }
    }
  } = state;

  return {
    singleHero: singleHeroData,
    isFetchingSingleHero
  };
}

export default connect(mapStateToProps)(GeneralTipsPage);
