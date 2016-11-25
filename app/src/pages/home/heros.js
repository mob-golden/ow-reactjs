import Ad from 'react-google-publisher-tag';
import Typeahead from '../../components/typeahead';
import React from 'react';

import take from 'lodash/take';
import uniqBy from 'lodash/uniqBy';

import Loader from '../../components/Loader';
import HerosGrid from '../../layout/HerosGrid';

import {
  Component,
  PropTypes
} from 'react';

import {
  connect
} from 'react-redux';

import {
  prepareAds
} from '../../utils/index';

import {
  adDimensions
} from '../../../constants/ads';

class Heros extends Component {
  static defaultProps = {
    ads: [
      'div-gpt-ad-1468534690919-8',
      'div-gpt-ad-1468534690919-9'
    ]
  };

  static propTypes = {
    heros: PropTypes.object.isRequired,
    isFetchingHeros: PropTypes.bool.isRequired
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
              {!isFetchingHeros && heros ?
                <HerosGrid
                  herosMap={heros.data} 
                  heros={take(uniqBy(heros.data, 'key'),36)}
                /> : <Loader /> } 
            </div>
          </div>
        </div>
        <Ad
          className="os-ad os-ad-bottom"
          dimensions={adDimensions.AFTER_SQUARE}
          path={'/22280732/ChampionSelect_300x250_HP_ATF1'}
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
