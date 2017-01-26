import Ad from 'react-google-publisher-tag';
import React from 'react';
import changeCase from 'change-case';

import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Loader from '../../loader';
import Typeahead from '../../typeahead';
import HeroFooter from '../hero/herofooter';
import Modal from '../../modal';
import PageNotFound from '../notfound/PageNotFound';

import { MATCHUP_TYPES } from '../../../constants/types';
import { adDimensions } from '../../../constants/ads';

class MatchupTipsPage extends Component {

  componentWillMount () {
    const {
      dispatch
    } = this.props;
  };

  componentWillUnmount () {

  }
  render () {
    const {
      children,
      heroesHash,
      heroesArray,
      isFetchingHeroes,
      params: {
        heroKey: _heroKey,
        matchupHeroKey: _matchupHeroKey,
        matchupType: _matchupType
      },
    } = this.props;

    const heroKey = changeCase.lower(_heroKey);
    const matchupHeroKey = changeCase.lower(_matchupHeroKey);
    const matchupType = changeCase.lower(_matchupType);


    if (isFetchingHeroes && !heroesHash) {
      return <Loader />;
    }

    if(!heroesHash[heroKey] || !heroesHash[matchupHeroKey] || !MATCHUP_TYPES.find(x => x==matchupType)){
      return (<PageNotFound/>);
    }

    return (
      <div className="os-body">
        <div className="os-content container">
          {/*<Ad
            className="os-ad os-ad-top"
            dimensions={adDimensions.BEFORE_RECT}
            path={'/22280732/ChampionSelect_728x90_HP_BTF1'}
          />*/}
          <div className="os-matchup row">
            <div className="col-lg-12">
              <div className="os-matchup-top">
                <div className="col-lg-4 col-xs-4">
                  <div className="os-hero-left-search mobile-hidden">
                    {this.renderHeroesModal(matchupType,matchupHeroKey,true)}
                    <div className="os-mini-search-btn" data-toggle="modal" data-target="#modal-choose-hero-left">
                      <i className="fa fa-search" aria-hidden="true"></i>
                    </div>
                  </div>
                  <div className="os-hero-left-profile">
                    <div className="os-profile-mask">
                      <Link to={`/hero/${heroKey}`}>
                        <img
                          width="72"
                          height="124"
                          className="os-hero-profile-icon"
                          src= {heroesHash[heroKey].portrait}
                        />
                        <div className="os-hero-profile-type">
                          <img width="16" height="17" src={`https://s3.amazonaws.com/solomid-resources/overwatch/icons/${heroesHash[heroKey].type}.png`}/>
                        </div>
                        <h5 className="os-hero-profile-name">{changeCase.upper(heroesHash[heroKey].name)}</h5>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4 col-xs-4">
                  <Link to={`/matchuptips/${matchupHeroKey}/${heroKey}/${matchupType}`}>
                    <div className="os-matchup-vs-img">
                    </div>
                  </Link>
                </div>

                <div className="col-lg-4 col-xs-4">
                  <div className="os-hero-right-profile">
                    <div className="os-profile-mask">
                      <Link to={`/hero/${matchupHeroKey}`}>
                        <img
                          width="72"
                          height="124"
                          className="os-hero-profile-icon"
                          src= {heroesHash[matchupHeroKey].portrait}
                        />
                        <div className="os-hero-profile-type">
                          <img width="16" height="17" src={`https://s3.amazonaws.com/solomid-resources/overwatch/icons/${heroesHash[matchupHeroKey].type}.png`}/>
                        </div>
                        <h5 className="os-hero-profile-name">{changeCase.upper(heroesHash[matchupHeroKey].name)}</h5>
                      </Link>
                    </div>
                  </div>
                  <div className="os-hero-right-search mobile-hidden">
                    {this.renderHeroesModal(matchupType,heroKey, false)}
                    <div className="os-mini-search-btn"  data-toggle="modal" data-target="#modal-choose-hero-right">
                      <i className="fa fa-search" aria-hidden="true"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="os-matchup-body">
                <div className="row">
                  <div className="col-lg-12">
                    <Link to={`/hero/${heroKey}/matchups`}>
                      <i className="fa fa-long-arrow-left" aria-hidden="true"/> back to Hero Matchups
                    </Link>
                  </div>
                </div>
                <div className="row">
                  {children}
                </div>
              </div>
            </div>
          </div>
          {/*<Ad
            className="os-ad os-ad-bottom"
            dimensions={adDimensions.AFTER_SQUARE}
            path={'/22280732/ChampionSelect_728x90_HP_BTF1'}
          />*/}
        </div>
        <div className="os-hero-footer">
          {!isFetchingHeroes && heroesArray ?
              <HeroFooter
                heroes={heroesArray}
              /> : <Loader /> }
        </div>
      </div>
    );
  }

  renderHeroesModal = (matchupType, otherHeroKey, isLeft) => {
    $("#modal-choose-hero-left").modal('hide');
    $("#modal-choose-hero-right").modal('hide');
    return (
      <div>
        <form>
          <Modal
            id={isLeft ? `modal-choose-hero-left`:`modal-choose-hero-right`}
          >
            <fieldset className="os-modal-form-group-1">
              <h4 className="os-modal-title">CHOOSE A HERO</h4>
              <span className="os-modal-description">Choose a Hero</span>
            </fieldset>
            <fieldset className="os-modal-form-group-2">
              { isLeft ?
                <Typeahead
                  constructLink={(id) => `/matchuptips/${id}/${otherHeroKey}/${matchupType}`}
                  inputGroupClass="input-group"
                  placeholder={"Search for a Hero"}
                />:
                <Typeahead
                  constructLink={(id) => `/matchuptips/${otherHeroKey}/${id}/${matchupType}`}
                  inputGroupClass="input-group"
                  placeholder={"Search for a Hero"}
                />
              }
            </fieldset>
            <fieldset className="os-modal-form-group-2">
              <div>
                { this.renderHeroesList(matchupType, otherHeroKey, isLeft) }
              </div>
            </fieldset>
          </Modal>
        </form>
      </div>
    );
  };

  renderHeroesList = (matchupType, otherHeroKey, isLeft) => {
    const {
      isFetchingHeroes,
      heroesArray
    } = this.props;

    if(isFetchingHeroes || !heroesArray) return;

    return (
      <div>
        {
          heroesArray.map(hero => {
            const {
              id,
              icon: image
            } = hero;

            return (
              <Link
                to= {isLeft ? `/matchuptips/${id}/${otherHeroKey}/${matchupType}`: `/matchuptips/${otherHeroKey}/${id}/${matchupType}`}
                key={id}
              >
                <div
                  className="os-hero-footer-thumb"
                >
                  <img
                    width="75"
                    height="75"
                    className="os-hero-footer-thumb-img"
                    src={image}
                  />
                </div>
              </Link>
            );
          })
        }
      </div>
    );
  }
}

function mapStateToProps (state) {
  const {
    hero: {
      heroes: {
        _array: heroesArray,
        _hash: heroesHash,
        isFetching: isFetchingHeroes
      }
    }
  } = state;

  return {
    heroesArray,
    heroesHash,
    isFetchingHeroes
  };
}

export default connect(mapStateToProps)(MatchupTipsPage);
