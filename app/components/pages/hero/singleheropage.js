import Ad from 'react-google-publisher-tag';
import React from 'react';
import changeCase from 'change-case';

import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Loader from '../../loader';
import Typeahead from '../../typeahead';
import HeroFooter from './herofooter';
import { adDimensions } from '../../../constants/ads';
import PageNotFound from '../notfound/PageNotFound';

class SingleHeroPage extends Component {

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
        heroKey: _heroKey
      },
      location: {
        pathname: _activePath
      }
    } = this.props;

    if (isFetchingHeroes || !heroesHash) {
      return <Loader />;
    }

    let activePath = _activePath.split('/').pop();
    let _generaltips, _heromatchups, _maprankings, _maprankingtips = false;

    if(activePath == "matchups" ) _heromatchups = 'active';
    else if(activePath == "maprankings" ) _maprankings = 'active';
    else if(_activePath.includes("maprankingtips")) {
      activePath = "maprankings";
      _maprankingtips = 'active';
    }
    else {
      activePath = "generaltips";
      _generaltips = "active";
    }

    const heroKey = changeCase.lower(_heroKey);

    if(!heroesHash[heroKey]){
      return (<PageNotFound/>);
    }

    const {
      id,
      name,
      type,
      portrait
    } = heroesHash[heroKey];

    return (
      <div className="os-body">
        <div className="os-content container">
          {/*<Ad
            className="os-ad os-ad-top"
            dimensions={adDimensions.BEFORE_RECT}
            path={'/22280732/ChampionSelect_728x90_HP_BTF1'}
          />*/}
          <div className="os-hero row">
            <div className="col-lg-12">
              <div className="os-content-top os-hero-top">
                <div className="col-lg-3">
                  <div className="os-hero-profile">
                    <div className="os-profile-mask">
                      <Link to={`/hero/${heroKey}`}>
                        <img
                          width="72"
                          height="124"
                          className="os-hero-profile-icon"
                          src= {portrait}
                        />
                        <div className="os-hero-profile-type">
                          <img width="16" height="17" src={`https://s3.amazonaws.com/solomid-resources/overwatch/icons/${type}.png`}/>
                        </div>
                        <h5 className="os-hero-profile-name">{changeCase.upper(name)}</h5>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-lg-9">
                  <div className="os-hero-search">
                    <Typeahead
                      constructLink={(id) => `/hero/${id}/${activePath}`}
                      inputGroupClass="input-group"
                      placeholder={"Search for a Hero"}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="os-content-body os-hero-body">
                { _heromatchups || _maprankings || _generaltips ?
                  <div className="row">
                    <div className="col-lg-12 center-text">
                      <ul className="os-hero-nav">
                        <li className={`os-hero-nav-item ${_generaltips}`}>
                          <Link to={`/hero/${id}/generaltips`}>GENERAL TIPS</Link>
                        </li>
                        <li className={`os-hero-nav-item ${_heromatchups}`}>
                          <Link to={`/hero/${id}/matchups`}>HERO MATCHUPS</Link>
                        </li>
                        <li className={`os-hero-nav-item ${_maprankings}`}>
                          <Link to={`/hero/${id}/maprankings`}>MAP RANKINGS</Link>
                        </li>
                      </ul>
                    </div>
                  </div> : null
                }

                { _maprankingtips?
                  <div className="row">
                    <div className="col-lg-12">
                      <Link to={`/hero/${id}/maprankings`}>
                        <i className="fa fa-long-arrow-left" aria-hidden="true"/> back to Map Matchups
                      </Link>
                    </div>
                  </div> : null
                }

                <div className="row os-tab-transition">
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
        <div className="os-hero-footer row">
          {!isFetchingHeroes && heroesArray ?
              <HeroFooter
                heroes={heroesArray}
              /> : <Loader /> }
        </div>
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

export default connect(mapStateToProps)(SingleHeroPage);
