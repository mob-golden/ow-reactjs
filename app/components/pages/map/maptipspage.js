import Ad from 'react-google-publisher-tag';
import React from 'react';
import changeCase from 'change-case';
import classNames from 'classnames';
import { take } from 'lodash';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Modal from '../../modal';

import TipsList from '../tip/tipslist';
import Loader from '../../loader';

import { fetchMapTipsIfNeeded } from '../../../actions/api';
import { addMapTip } from '../../../actions/all';
import { MAPS_HASH } from '../../../constants/types';
import { adDimensions } from '../../../constants/ads';

class MapTipsPage extends Component {

  constructor (props) {
    super(props);
    this.state = {
      viewAll: false
    };
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

    const viewAllClassName = classNames({
      'btn btn-secondary os-btn-white':true,
      'hidden': mapTips.data.tips.length < 9
    });
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
        
        <div className="os-map-tip row">
          <div className="col-lg-12">
            <div className="os-map-tip-header">
              <div className="os-map-tip-header-background">
                <img className="os-map-tip-header-image" src={mapImage}/>
              </div>
              <div className="os-map-tip-header-title">
                <span className="os-white os-font-size-20">
                  { changeCase.upper(MAPS_HASH[mapType]) } 
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
                <div className="os-card-container os-map-tip-container">
                  <div className="row">
                    <div className="col-lg-7">
                      { this.renderModal(mapKey, mapName) }
                      <div className="os-card-col os-map-tip-col">
                        <span className="os-map-tip-name">
                          {changeCase.upper(mapName)} 
                        </span>
                        <h5 className="os-map-tip-title">
                          MAP TIPS
                        </h5>
                        <TipsList 
                          tips={
                            this.state.viewAll?
                            mapTips.data.tips:
                            take(mapTips.data.tips, 8)
                          }
                          firstText={`Share a tip on how to play on ${mapName}.`}
                        />
                        <div className="os-tip-button-group">
                          <button
                            className="btn btn-primary os-btn-blue"
                            data-toggle="modal"
                            data-target={`#modal-add-map-tip`}
                          >
                            ADD A TIP
                          </button>
                          <button
                            className={viewAllClassName}
                            onClick={() => this.setState({viewAll: !this.state.viewAll })}
                          >
                          { this.state.viewAll?`VIEW LESS`:`VIEW ALL`}
                          </button>
                        </div>
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

  renderModal = (mapKey, mapName) => {
    const {
      dispatch,
      token
    } = this.props;
    if(token){
      return (
        <div>
          <form onSubmit={e => {
              e.preventDefault();
              const textarea = this._tipsBox;
              if (textarea && textarea.value) {
                dispatch(addMapTip({
                  mapKey: mapKey,
                  content: textarea.value,
                  token
                }));
              }
              $(`#modal-add-map-tip`).modal('hide');
            }}>
            <Modal 
              id={`modal-add-map-tip`}
            >
              <fieldset className="os-modal-form-group-1">
                <h4 className="os-modal-title">{`NEW TIP FOR ${changeCase.upper(mapName)}`}</h4>
                <span className="os-modal-description">{`Add a tip for ${mapName}`}</span>
              </fieldset>
              <fieldset className="os-modal-form-group-2">
                <textarea
                  className="form-control os-textarea"
                  placeholder={`Share tips of how to play on ${mapName}`}
                  ref={c => this._tipsBox = c}
                  rows={9}
                >
                </textarea>
              </fieldset>
              <fieldset className="os-modal-form-group-2">
                <button
                  className="btn btn-primary os-btn-blue"
                  type="submit"
                >SUBMIT</button>
              </fieldset>
            </Modal>
          </form>
        </div>
      );
    }
  };
}

function mapStateToProps (state) {
  const {
    auth: {
      token
    },
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
    token,
    mapTips,
    isFetchingMapTips,
    mapsHash,
    isFetchingMaps
  };
}

export default connect(mapStateToProps)(MapTipsPage);
