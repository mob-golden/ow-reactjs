import Ad from 'react-google-publisher-tag';
import React from 'react';
import changeCase from 'change-case';

import { take, uniqBy, toArray } from 'lodash';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Loader from '../../loader';
import Typeahead from '../../typeahead';
import HeroesGrid from './heroesgrid';
import TabsNav from '../../tabsnav';

import { prepareAds } from '../../ads';
import { adDimensions } from '../../../constants/ads';
import { HERO_TYPES } from '../../../constants/types';


class HomePage extends Component {
  static defaultProps = {
    ads: [
      'div-gpt-ad-1468534690919-8',
      'div-gpt-ad-1468534690919-9'
    ]
  };

  // static propTypes = {
  //   heroes: PropTypes.object.isRequired,
  //   isFetchingHeroes: PropTypes.bool.isRequired
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
      heroes,
      isFetchingHeroes
    } = this.props;
      
    return (
      <div className="os-content container">
        <Ad
          className="os-ad os-ad-top"
          dimensions={adDimensions.BEFORE_RECT}
          path={'/22280732/ChampionSelect_728x90_HP_BTF1'}
        />
        <div className="os-heroes row">
          <div className="col-lg-12">
            <div className="os-heroes-top">
              <p className="os-white os-font-size-18"> Search for a hero to find counterpicks, general counters, hero synergy, and more!</p>
              <div className="col-lg-8 col-xs-12 col-lg-offset-2">
                <Typeahead
                  constructLink={(id) => `/heroes/${id.toLowerCase()}`}
                  inputGroupClass="input-group"
                  placeholder={"Search for a Hero"}
                />
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="os-heroes-body">
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
              {!isFetchingHeroes && heroes ?
                <HeroesGrid
                  heroes={take(toArray(heroes.data), 22)}
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
      heroes: {
        data: heroesData,
        isFetching: isFetchingHeroes
      }
    }
  } = state;
  
  return {
    heroes: heroesData,
    isFetchingHeroes
  };
}

export default connect(mapStateToProps)(HomePage);
