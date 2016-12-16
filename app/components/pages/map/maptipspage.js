import Ad from 'react-google-publisher-tag';
import React from 'react';
import changeCase from 'change-case';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import TipsList from '../tip/tipslist';
import Loader from '../../loader';

import { fetchMapTipsIfNeeded } from '../../../actions/api';
import { adDimensions } from '../../../constants/ads';

class MapTipsPage extends Component {

  constructor (props) {
    super(props);
  }

  componentWillMount () {
    const {
      params:{
        mapKey: _mapKey
      },
      dispatch
    } = this.props;

    const mapKey = changeCase.lower(_mapKey);
    dispatch(fetchMapTipsIfNeeded(mapKey));
  };

  componentWillUnmount () {
    $('.os-ad-side').remove();
  }

  render () {

    const {
      params:{
        mapKey: _mapKey
      },
      mapTips,
      isFetchingMapTips,
      mapsHash,
      isFetchingMaps
    } = this.props;

    if(isFetchingMaps || !mapsHash || isFetchingMapTips || !mapTips){
      return (<Loader/>);
    }

    const mapKey = changeCase.lower(_mapKey);
    const{
      type: mapType,
      name: mapName,
      image: mapImage
    } = mapsHash[mapKey];

    return (
      <div className="container os-content">
        <Ad
          className="os-ad os-ad-top"
          dimensions={adDimensions.BEFORE_RECT}
          path={'/22280732/ChampionSelect_728x90_HP_BTF1'}
        />
        
        <div className="os-map row">
          <div className="col-lg-12">
            <div className="os-map-tip-header">
              <div className="os-map-tip-header-background">
                <img className="os-map-tip-header-image" src={mapImage}/>
              </div>
              <div className="os-map-tip-header-title">
                <span className="os-white os-font-size-20">
                  { changeCase.upper(mapType) } 
                </span>
                <h5 className="os-white os-font-size-32">
                  { mapName }
                </h5>
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="os-map-tip-body">
              <div className="row">
                <div className="col-lg-12">
                  <Link to={`/maps`}>
                    <i className="fa fa-long-arrow-left" aria-hidden="true"/> back to All Maps
                  </Link>
                </div>
              </div>
              <div className="row">
                <div className="os-map-tip-container">
                  <div className="row">
                    <div className="col-lg-7">
                      <div className="os-map-tip-col">
                        <span className="os-hero-tip-name">
                          {changeCase.upper(mapName)} 
                        </span>
                        <h5 className="os-hero-tip-title">
                          MAP TIPS
                        </h5>
                        <TipsList 
                          tips={mapTips.data.tips}
                          shouldHideMeta={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
    api: {
      mapTips:{
        data: mapTips,
        isFetching: isFetchingMapTips
      }
    },
    map: {
      maps: {
        _hash: mapsHash,
        isFetching: isFetchingMaps
      }
    }
  } = state;
  return {
    mapTips,
    isFetchingMapTips,
    mapsHash,
    isFetchingMaps
  };
}

export default connect(mapStateToProps)(MapTipsPage);
