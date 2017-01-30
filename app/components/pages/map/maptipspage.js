import Ad from 'react-google-publisher-tag';
import React from 'react';
import changeCase from 'change-case';
import classNames from 'classnames';
import { take } from 'lodash';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Modal from '../../modal';

import TipList from '../tip/tiplist';
import MatchupList from '../matchup/matchuplist';
import Loader from '../../loader';

import {
  fetchMapTipsIfNeeded,
  fetchMapMatchupsIfNeeded
} from '../../../actions/api';

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

  handleMatchupViewAll(){
    this.setState({matchupViewAll: !this.state.matchupViewAll });
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
    dispatch(fetchMapMatchupsIfNeeded(mapKey));
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
      mapMatchups,
      isFetchingMapMatchups
    } = this.props;

    if( isFetchingMapTips || !mapTips || isFetchingMapMatchups || !mapMatchups){
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
    } = mapTips.data;

    const matchupViewAllClassName = classNames({
      'btn btn-secondary os-btn-white':true,
      'hidden': mapMatchups.data.matchups.length < 4
    });

    return (
      <div className="container os-content">
        {/*<Ad
          className="os-ad os-ad-top"
          dimensions={adDimensions.BEFORE_RECT}
          path={'/22280732/ChampionSelect_728x90_HP_BTF1'}
        />*/}

        <div className="os-map-tip row">
          <div className="col-lg-12">
            <div className="os-content-top os-map-tip-header">
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
            <div className="os-content-body os-map-tip-body">
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
                    <div className="os-card-col os-map-tip-col col-lg-8">
                      { this.renderModal(mapKey, mapName) }
                      <div className="os-card-body">
                        <span className="os-map-tip-name">
                          {changeCase.upper(mapName)}
                        </span>
                        <h5 className="os-map-tip-title">
                          MAP TIPS
                        </h5>
                        <TipList
                          masterKey={mapKey}
                          listId="maptip"
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
                            onClick={this.handleAddMapTip.bind(null, 'against')}
                          >
                            ADD A TIP
                          </button>
                          <button
                            className={viewAllClassName}
                            onClick={() => this.setState({viewAll: !this.state.viewAll })}
                          >
                          { this.state.viewAll?`VIEW LESS`:`VIEW MORE`}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="os-card-col os-map-stats-col col-lg-4">
                      <div className="os-card-body">
                        <span className="os-map-tip-name"> TOP HEROES </span>
                        <h5 className="os-map-tip-title"> VOTED BY PLAYERS </h5>
                        <MatchupList
                          heroKey={mapKey}
                          matchups={
                            this.state.matchupViewAll?
                            mapMatchups.data.matchups:
                            take(mapMatchups.data.matchups, 3)
                          }
                          matchupType = "map"
                          firstText = {`No Heroes.`}
                          customType = "mapMatchup"
                        />
                        <div className="row center-text">
                          <button
                            className={matchupViewAllClassName}
                            onClick={() => this.handleMatchupViewAll()}
                          >
                            { this.state.matchupViewAll?`VIEW LESS`:`VIEW MORE`}
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

        {/*<Ad
          className="os-ad os-ad-bottom"
          dimensions={adDimensions.AFTER_SQUARE}
          path={'/22280732/ChampionSelect_300x250_HP_ATF1'}
        />*/}
      </div>
    );
  }

  handleAddMapTip = (type) =>{
    const localToken = localStorage.getItem('token');
    if(!localToken){
      $('#sign-in').modal('show');
    }
    else{
      $(`#modal-add-map-tip`).modal('show');
    }
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
                const tmp_data = {
                  _id:'9999999999',
                  authorName: localStorage.getItem('username'),
                  contentRaw: textarea.value,
                  created_at: "2000-01-01T00:00:00.938Z",
                  score: {
                    upvotes: 1,
                    downvotes: 0,
                    hotScore: 1,
                    total: 1,
                  },
                  type: "map"
                };
                this.props.mapTips.data.tips.push(tmp_data);
                this.forceUpdate();
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
      },
      mapMatchups: {
        data: mapMatchups,
        isFetching: isFetchingMapMatchups
      }
    }
  } = state;
  return {
    token,
    mapTips,
    isFetchingMapTips,
    mapMatchups,
    isFetchingMapMatchups
  };
}

export default connect(mapStateToProps)(MapTipsPage);
