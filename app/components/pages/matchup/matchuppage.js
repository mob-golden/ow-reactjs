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
import HeroFooter from '../hero/herofooter';

import { prepareAds } from '../../ads';
import { adDimensions } from '../../../constants/ads';

import { fetchCounterTipsIfNeeded } from '../../../actions/api';

import { RIOT_HERO_ICONS_URL } from '../../../constants/urls';
import { TIP_TYPES } from '../../../constants/types';

class MatchupPage extends Component {
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
      params: {
        heroKey: _heroKey,
        matchupHeroKey: _matchupHeroKey
      },
    } = this.props;
    
    const heroKey = changeCase.lower(_heroKey);
    const matchupHeroKey = changeCase.lower(_matchupHeroKey);

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
                  <div className="col-lg-6">
                    <div className="os-matchup-vs-img">
                    </div>
                  </div>
                  <div className="col-lg-3">
                    
                  </div>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="os-hero-body">
                  <div className="row">
                    <div className="center-text">
                      <p>back to Hero Matchups</p>
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

export default connect(mapStateToProps)(MatchupPage);
