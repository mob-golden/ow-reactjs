import React from 'react';
import changeCase from 'change-case';
import classNames from 'classnames';
import { take } from 'lodash';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import TipsList from '../tip/tipslist';
import Loader from '../../loader';
import Modal from '../../modal';
import { fetchMatchupTipsIfNeeded } from '../../../actions/api';
import { addHeroMatchupTip } from '../../../actions/all';

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
      'hidden': tipsAgainst.length < 6
    });
    return (
      <div className="os-card-container os-matchup-tip-container">
        <div className="row">
          <div className="os-card-col os-matchup-tip-col">
            { this.renderModal('for', heroKey, matchupHeroKey, heroName) }
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
                  data-target={`#modal-add-matchup-tip-for`}
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

<<<<<<< HEAD
          <div className="os-card-col os-matchup-tip-col">
            <div className="os-card-body os-matchup-tip-body">
=======
          <div className="os-matchup-tip-col">
            { this.renderModal('against', heroKey, matchupHeroKey, heroName) }
            <div className="os-matchup-tip-body">
>>>>>>> dev
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
                  data-target={`#modal-add-matchup-tip-against`}
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

  renderModal = (type, heroKey, matchupHeroKey, heroName) => {
    const {
      dispatch,
      token
    } = this.props;
    this._tipsBox = {
      type: {}
    };
    if(token){
      return (
        <div>
          <form onSubmit={e => {
              e.preventDefault();
              const textarea = this._tipsBox[type];
              if (textarea && textarea.value) {
                const localUserId = localStorage.getItem('userId');
                const localUsername = localStorage.getItem('username');

                dispatch(addHeroMatchupTip({
                  authorId: localUserId,
                  authorName: localUsername,
                  heroKey: heroKey,
                  matchupKey: matchupHeroKey,
                  content: textarea.value,
                  tipType: type,
                  token
                }));
                // dispatch(fetchTipsIfNeeded(heroKey));
              }
              $(`#modal-add-matchup-tip-${type}`).modal('hide');
              // location.reload();
            }}>
            <Modal 
              id={`modal-add-matchup-tip-${type}`}
            >
              <fieldset className="os-modal-form-group-1">
                <h4 className="os-modal-title">{`NEW TIP ${changeCase.upper(type)} ${changeCase.upper(heroName)}`}</h4>
                <span className="os-modal-description">{`Add a tip ${type} ${heroName}`}</span>
              </fieldset>
              <fieldset className="os-modal-form-group-2">
                <textarea
                  className="form-control os-textarea"
                  placeholder={type == "for" ? 
                                `Share strategies and tips on how to play ${heroName}.`:
                                `Share counter tips on how to play ${heroName}.`}
                  ref={c => this._tipsBox[type] = c}
                  rows={9}
                >
                </textarea>
              </fieldset>
              <fieldset className="os-modal-form-group-2">
                <button
                  className="btn btn-primary os-btn-blue"
                  type="submit"
                >SUBMIT</button>
              </fieldset>
            </Modal>
          </form>
        </div>
      );
    }
  };

}


function mapStateToProps (state) {
  const {
    auth: {
      token
    },
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
    token,
    heroesHash,
    isFetchingHeroes, 
    matchupTips: matchupTipsData,
    isFetchingMatchupTips
  };
}

export default connect(mapStateToProps)(MatchupTipsPage);
