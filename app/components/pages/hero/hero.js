import Ad from 'react-google-publisher-tag';
import React from 'react';
import changeCase from 'change-case';

import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Loader from '../../loader';
import Typeahead from '../../typeahead';
import TabsNav from '../../tabsNav';

import { prepareAds } from '../../ads';
import { adDimensions } from '../../../constants/ads';

class Hero extends Component {
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
      isFetchingHeros,
      params: {
        heroKey: _heroKey
      }
    } = this.props;
    
    const heroKey = _heroKey;
    if (!isFetchingHeros && heros) {
      const herosMap = heros.data;

      // const {
      //   image: {
      //     full
      //   }
      // } = herosMap[heroKey];

      return (
        <div className="container os-content">
          <Ad
            className="os-ad os-ad-top"
            dimensions={adDimensions.BEFORE_RECT}
            path={'/22280732/ChampionSelect_728x90_HP_BTF1'}
          />
          <div className="os-hero row">
            <div className="col-lg-9">
              <div className="os-home-search-div">
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
    return <Loader />;
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

export default connect(mapStateToProps)(Hero);
