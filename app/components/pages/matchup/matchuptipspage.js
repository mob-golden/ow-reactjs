import React from 'react';
import changeCase from 'change-case';
import { take } from 'lodash';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import TipsList from '../tip/tipslist';
import Loader from '../../loader';
import { fetchMatchupTipsIfNeeded } from '../../../actions/api';

class MatchupTipsPage extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
  }

  componentWillMount () {
    const {
      dispatch,
      params: {
        heroKey: _heroKey,
        matchupHeroKey: _matchupHeroKey
      }
    } = this.props;

    const heroKey = changeCase.lower(_heroKey);
    const matchupHeroKey = changeCase.lower(_matchupHeroKey);


    dispatch(fetchMatchupTipsIfNeeded(heroKey,matchupHeroKey));
  }

  componentWillReceiveProps (nextProps) {
    const {
      dispatch,
      params: {
        heroKey: _heroKey,
        matchupHeroKey: _matchupHeroKey
      }
    } = this.props;

    const {
      params: {
        heroKey: _nextHeroKey,
        matchupHeroKey: _nextMatchupHeroKey
      }
    } = nextProps;

    const heroKey = changeCase.lower(_heroKey);
    const matchupHeroKey = changeCase.lower(_matchupHeroKey);

    const nextHeroKey = changeCase.lower(_nextHeroKey);
    const nextMatchupHeroKey = changeCase.lower(_nextMatchupHeroKey);

    if (heroKey !== nextHeroKey || matchupHeroKey !== nextMatchupHeroKey) {
      dispatch(fetchMatchupTipsIfNeeded(nextHeroKey,nextMatchupHeroKey));
    }
  }

  render () {
    const {
      heroesHash,
      isFetchingHeroes,
      matchupTips,
      isFetchingMatchupTips,
      params: {
        heroKey: _heroKey,
        matchupHeroKey: _matchupHeroKey
      },
      token
    } = this.props;

    // const {
    //   showCounterTipsForm
    // } = this.state;

    const heroKey = changeCase.lower(_heroKey);
    const matchupHeroKey = changeCase.lower(_matchupHeroKey);

    if(isFetchingMatchupTips || !matchupTips.for || !matchupTips.against || isFetchingHeroes || !heroesHash){
      return (<Loader/>);
    }

    return (
      <div className="os-matchup-tip-container">
        <div className="row">
          <div className="os-matchup-tip-col">
            <div className="os-matchup-tip-body">
              <span className="os-matchup-tip-name">
                TIPS VS. {changeCase.upper(heroesHash[matchupHeroKey].name)} 
              </span>
              <h5 className="os-matchup-left-title">AS <span>{changeCase.upper(heroesHash[heroKey].name) }</span></h5>

              <TipsList
                tips={take(matchupTips.for.data, 5)}
              />
              <div className="row">
                <div className="col-lg-3">
                  <a href="#" className="btn btn-primary os-btn-blue">ADD A TIP</a>
                </div>
                <div className="col-lg-3"> 
                  <a href="#" className="btn btn-secondary os-btn-white">VIEW ALL</a>
                </div>
              </div>
            </div>
          </div>

          <div className="os-hero-tip-col">
            <div className="os-hero-tip-body">
              <span className="os-matchup-tip-name">
                TIPS VS. {changeCase.upper(heroesHash[heroKey].name)} 
              </span>
              <h5 className="os-matchup-right-title">AS <span>{changeCase.upper(heroesHash[matchupHeroKey].name) }</span></h5>

              <TipsList
                tips={take(matchupTips.against.data, 5)}
              />
              <div className="row">
                <div className="col-lg-3">
                  <a href="#" className="btn btn-primary os-btn-blue">ADD A TIP</a>
                </div>
                <div className="col-lg-3"> 
                  <a href="#" className="btn btn-secondary os-btn-white">VIEW ALL</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps (state) {
  const {
    hero: {
      heroes: {
        _hash: heroesHash,
        isFetching: isFetchingHeroes
      }
    },
    api: {
      matchupTips: {
        matchupTips: matchupTipsData,
        isFetching: isFetchingMatchupTips
      }
    }
  } = state;

  return {
    heroesHash,
    isFetchingHeroes, 
    matchupTips: matchupTipsData,
    isFetchingMatchupTips
  };
}

export default connect(mapStateToProps)(MatchupTipsPage);
