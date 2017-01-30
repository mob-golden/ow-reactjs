import Ad from 'react-google-publisher-tag';
import React from 'react';
import changeCase from 'change-case';
import Loader from '../../loader';
import TabsNav from '../../tabsnav';
import MapsGrid from './mapsgrid';
import PageNotFound from '../notfound/PageNotFound';

import { fetchMapsIfNeeded } from '../../../actions/map';

import { Component, PropTypes } from 'react';

import {
  connect
} from 'react-redux';

import { MAP_TYPES } from '../../../constants/types';
import { adDimensions } from '../../../constants/ads';

class MapsPage extends Component {

  constructor (props) {
    super(props);
  }

  componentWillMount () {
    const {
      dispatch
    } = this.props;

    // dispatch(fetchMapsIfNeeded());
  };

  componentWillUnmount () {
    // $('.os-ad-side').remove();
  }

  render () {
    const {
      mapsArray,
      isFetchingMaps,
      params:{
        mapType: _mapType
      }
    } = this.props;

    const mapType = _mapType?changeCase.lower(_mapType):'all';

    if(!MAP_TYPES.find(x => x.name == mapType)){
      return (<PageNotFound/>);
    }
    return (
      <div className="container os-content">
        {/*<Ad
          className="os-ad os-ad-top"
          dimensions={adDimensions.BEFORE_RECT}
          path={'/22280732/ChampionSelect_728x90_HP_BTF1'}
        />*/}
        <div className="os-maps row">
          <div className="col-lg-12">
            <div className="os-content-top os-maps-top">
              <h2 className="os-white">CHOOSE A MAP</h2>
              <p className="os-white hidden-xs-down os-font-size-18">
                The list below is sorted alphabetically, the maps are not ranked in any way. <br/>
                Choose a map below to find recommended Heroes for each map.
              </p>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="os-content-body os-maps-body">
              <div>
                <TabsNav
                  activeType={mapType}
                  tabs={MAP_TYPES.map(type => {
                    return {
                      label: changeCase.upper(type.title),
                      link: type.link,
                      name: type.name
                    };
                  })}
                />
              </div>
              <div className="os-tab-transition">
                { !isFetchingMaps && mapsArray ?
                  <MapsGrid
                    filter={mapType}
                    maps={mapsArray}
                  /> : <Loader /> }
              </div>
            </div>
          </div>

        </div>
        {/*<Ad
          className="os-ad os-ad-bottom"
          dimensions={adDimensions.AFTER_SQUARE}
          path={'/22280732/ChampionSelect_300x250_HP_ATF1'}
        />*/}
      </div>
    );
  }
}

function mapStateToProps (state) {
  const {
    map: {
      maps: {
        _array: mapsArray,
        isFetching: isFetchingMaps
      }
    }
  } = state;
  return {
    mapsArray,
    isFetchingMaps
  };
}

export default connect(mapStateToProps)(MapsPage);
