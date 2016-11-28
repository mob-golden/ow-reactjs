import Ad from 'react-google-publisher-tag';
import React from 'react';
import changeCase from 'change-case';

import { take, uniqBy, toArray } from 'lodash';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Loader from '../../loader';
import Typeahead from '../../typeahead';
import HerosGrid from './herosGrid';
import TabsNav from '../../tabsNav';

import { prepareAds } from '../../ads';
import { adDimensions } from '../../../constants/ads';
import { HERO_TYPES } from '../../../constants/types';


class Heros extends Component {
  static defaultProps = {
    ads: [
      'div-gpt-ad-1468534690919-8',
      'div-gpt-ad-1468534690919-9'
    ]
  };

  // static propTypes = {
  //   heros: PropTypes.object.isRequired,
  //   isFetchingHeros: PropTypes.bool.isRequired
  // };

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
      ads,
      heros,
      isFetchingHeros
    } = this.props;
      
    return (
      <div className="container os-content">
        <Ad
          className="os-ad os-ad-top"
          dimensions={adDimensions.BEFORE_RECT}
          path={'/22280732/ChampionSelect_728x90_HP_BTF1'}
        />
        <div className="os-home row">
          <div className="col-lg-12">
            <div className="os-home-search-div">
              <p className="os-white hidden-xs-down os-font-size-18"> Search for a hero to find counterpicks, general counters, hero synergy, and more!</p>
              <div className="col-lg-8 col-xs-12 col-lg-offset-2 centered">
                <Typeahead
                  constructLink={(id) => `/heros/${id.toLowerCase()}`}
                  inputGroupClass="input-group"
                  placeholder={"Search for a Hero"}
                />
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="os-home-box">
              <p className="hidden-xs-down os-font-size-18"> Choose a hero below to find counterpicks, general counters, hero synergy, and more!</p>
              <div>
                <TabsNav
                  activeTabId={'all'}
                  handleClick={activeTabId => activeTabId}
                  tabs={HERO_TYPES.map(type => {
                    return {
                      id: type,
                      label: changeCase.upper(type)
                    };
                  })}
                />
              </div>
              {!isFetchingHeros && heros ?
                <HerosGrid
                  heros={toArray(heros.data)}
                /> : <Loader /> } 
            </div>
          </div>
        </div>
        <Ad
          className="os-ad os-ad-bottom"
          dimensions={adDimensions.AFTER_SQUARE}
          path={'/22280732/ChampionSelect_728x90_HP_BTF1'}
        />
      </div>
    );
  }
}

function mapStateToProps (state) {
  const {
    riot: {
      heros: {
        data: herosData,
        isFetching: isFetchingHeros
      }
    }
  } = state;
  
  return {
    heros: herosData,
    isFetchingHeros
  };
}

export default connect(mapStateToProps)(Heros);
