import React from 'react';
import changeCase from 'change-case';
import classNames from 'classnames';
import { take } from 'lodash';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import TipsList from '../tip/tipslist';
import Loader from '../../loader';
import { fetchMatchupTipsIfNeeded } from '../../../actions/api';

class MatchupTipsPage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      leftViewAll: false,
      rightViewAll: false
    };
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

    const heroName = heroesHash[heroKey].name;
    const matchupName = heroesHash[matchupHeroKey].name;

    if(isFetchingMatchupTips || !matchupTips.for || !matchupTips.against || isFetchingHeroes || !heroesHash){
      return (<Loader/>);
    }

    const tipsFor = matchupTips.for.data.tips;
    const tipsAgainst = matchupTips.against.data.tips;

    const leftViewAllClassName = classNames({
      'btn btn-secondary os-btn-white':true,
      'hidden': tipsFor.length < 6
    });

    const rightViewAllClassName = classNames({
      'btn btn-secondary os-btn-white':true,
      //'hidden': tipsAgainst.length < 6
    });
    return (
      <div className="os-card-container os-matchup-tip-container">
        <div className="row">
          <div className="os-card-col os-matchup-tip-col">
            <div className="os-card-body os-matchup-tip-body">
              <span className="os-matchup-tip-name">
                TIPS VS. {changeCase.upper(matchupName)} 
              </span>
              <h5 className="os-matchup-left-title">
                AS <span>{changeCase.upper(heroName) }</span>
              </h5>

              <TipsList
                tips={
                  this.state.leftViewAll?
                  tipsFor:
                  take(tipsFor, 5)
                }
                firstText={`Share a tip on how to play ${heroName}.`}
              />
              <div className="os-hero-tip-button-group">
                <button
                  className="btn btn-primary os-btn-blue"
                  data-toggle="modal"
                  data-target={`#modal-add-tip-for`}
                >
                  ADD A TIP
                </button>
                <button
                  className={leftViewAllClassName}
                  onClick={() => this.setState({leftViewAll: !this.state.leftViewAll })}
                >
                { this.state.leftViewAll?`VIEW LESS`:`VIEW ALL`}
                </button>
              </div>
            </div>
          </div>

          <div className="os-card-col os-matchup-tip-col">
            <div className="os-card-body os-matchup-tip-body">
              <span className="os-matchup-tip-name">
                TIPS VS. {changeCase.upper(heroName)} 
              </span>
              <h5 className="os-matchup-right-title">
                AS <span>{changeCase.upper(matchupName) }</span>
              </h5>

              <TipsList
                tips={
                  this.state.rightViewAll?
                  tipsAgainst:
                  take(tipsAgainst, 5)
                }
                firstText={`Share a tip on how to play against ${heroName}.`}
              />
              <div className="os-hero-tip-button-group">
                <button
                  className="btn btn-primary os-btn-blue"
                  data-toggle="modal"
                  data-target={`#modal-add-tip-against`}
                >
                  ADD A TIP
                </button>
                <button
                  className={rightViewAllClassName}
                  onClick={() => this.setState({rightViewAll: !this.state.rightViewAll })}
                >
                { this.state.rightViewAll?`VIEW LESS`:`VIEW ALL`}
                </button>
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
