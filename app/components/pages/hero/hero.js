import Ad from 'react-google-publisher-tag';
import React from 'react';
import changeCase from 'change-case';

import { take, uniqBy, toArray, slice } from 'lodash';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Loader from '../../loader';
import Typeahead from '../../typeahead';
import TabsNav from '../../tabsnav';
import HeroFooter from './herofooter';

import { prepareAds } from '../../ads';
import { adDimensions } from '../../../constants/ads';

import { fetchCounterTipsIfNeeded } from '../../../actions/api';

import { RIOT_HERO_ICONS_URL } from '../../../constants/urls';
import { TIP_TYPES } from '../../../constants/types';

class Hero extends Component {
  static defaultProps = {
    ads: [
      'div-gpt-ad-1468534690919-8',
      'div-gpt-ad-1468534690919-9'
    ]
  };

  componentWillMount () {
    const {
      ads,
      dispatch
    } = this.props;

    prepareAds(ads);
  };
  componentWillUnmount () {

  }
  render () {
    const {
      children,
      ads,
      heros,
      isFetchingHeros,
      counterTips,
      isFetchingCounterTips,
      params: {
        heroKey: _heroKey
      },
      location: {
        pathname: _activePath
      }
    } = this.props;
    
    const activePath = _activePath.split('/').pop();
    let _generaltips = "";
    let _heromatchups = "";
    let _maprankings = "";
    if(activePath == "matchups" ) _heromatchups = 'active';
    else if(activePath == "maprankings" ) _maprankings = 'active';
    else _generaltips = "active";

    const heroKey = changeCase.lower(_heroKey);
    if (!isFetchingHeros && heros) {
      const herosMap = heros.data;

      const {
        id,
        name,
        image: {
          full
        }
      } = herosMap[heroKey];

      return (
        <div className="os-body row">
          <div className="os-content container">
            <Ad
              className="os-ad os-ad-top"
              dimensions={adDimensions.BEFORE_RECT}
              path={'/22280732/ChampionSelect_728x90_HP_BTF1'}
            />
            <div className="os-hero row">
              <div className="col-lg-12">
                <div className="os-hero-top">
                  <div className="col-lg-3">
                    <div className="os-hero-profile">
                      <Link to={`/heros/${heroKey}`}>
                        <div className="os-profile-mask"></div>
                        <img
                          width="72"
                          height="124"
                          className="os-hero-profile-icon"
                          src= "https://s3.amazonaws.com/solomid-resources/overwatch/heroes/ana/hero-select-portrait.png"
                        />
                        {/*`${RIOT_HERO_ICONS_URL}/${full}`*/}
                        <div className="os-hero-profile-type"></div>
                        <h5 className="os-hero-profile-name">{changeCase.upper(herosMap[heroKey].name)}</h5>
                      </Link>
                    </div>
                  </div>
                  <div className="col-lg-9">
                    <div className="os-hero-search">
                      <Typeahead
                        constructLink={(id) => `/heros/${id.toLowerCase()}`}
                        inputGroupClass="input-group"
                        placeholder={"Search for a matchup"}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="os-hero-body">
                  <div className="row">
                    <div className="center-text">
                      <ul className="os-hero-nav">
                        <li className={`os-hero-nav-item ${_generaltips}`}> 
                          <Link to={`/heros/${id}/generaltips`}>GENERAL TIPS</Link> 
                        </li>
                        <li className={`os-hero-nav-item ${_heromatchups}`}> 
                          <Link to={`/heros/${id}/matchups`}>HERO MATCHUPS</Link> 
                        </li>
                        <li className={`os-hero-nav-item ${_maprankings}`}> 
                          <Link to={`/heros/${id}/maprankings`}>MAP RANKINGS</Link> 
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="row">
                    {children}
                  </div>
                </div>
              </div>
            </div>
            <Ad
              className="os-ad os-ad-bottom"
              dimensions={adDimensions.AFTER_SQUARE}
              path={'/22280732/ChampionSelect_728x90_HP_BTF1'}
            />
          </div>
          <div className="os-hero-footer">
            {!isFetchingHeros && heros ?
                <HeroFooter
                  heros={take(toArray(heros.data),22)}
                /> : <Loader /> }
          </div>
        </div>
      );
    }
    return <Loader />;
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
    isFetchingHeros,
    counterTips: counterTipsData,
    isFetchingCounterTips
  };
}

export default connect(mapStateToProps)(Hero);
