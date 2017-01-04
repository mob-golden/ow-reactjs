import React from 'react';
import changeCase from 'change-case';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Modal from '../../modal';
import MapRankingsList from './maprankingslist';
import MapTypeahead from '../../maptypeahead';
import Loader from '../../loader';

import { addHeroMatchup } from '../../../actions/all';
import { fetchMatchupsIfNeeded } from '../../../actions/api';

import {  MAPS_HASH } from '../../../constants/types';

class MapRankingsPage extends Component {

  constructor (props) {
    super(props);
  }

  componentDidMount () {
  }

  componentWillMount () {
    const {
      dispatch,
      params: {
        heroKey: _heroKey
      }
    } = this.props;

    const heroKey = changeCase.lower(_heroKey);

    dispatch(fetchMatchupsIfNeeded(heroKey));
  }

  componentWillReceiveProps (nextProps) {
    const {
      dispatch,
      params: {
        heroKey: _heroKey
      }
    } = this.props;

    const {
      params: {
        heroKey: _nextHeroKey
      }
    } = nextProps;

    const heroKey = changeCase.lower(_heroKey);
    const nextHeroKey = changeCase.lower(_nextHeroKey);

    if (heroKey !== nextHeroKey) {
      dispatch(fetchMatchupsIfNeeded(nextHeroKey));
    }
  }
  render () {
    const {
      children,
      mapsHash,
      isFetchingMaps,
      matchups,
      isFetchingMatchups,
      params: {
        heroKey: _heroKey
      },
      token
    } = this.props;

    if(isFetchingMatchups || !matchups.map || isFetchingMaps || !mapsHash){
      return (<Loader/>);
    }

    const heroKey = changeCase.lower(_heroKey);
    const heroName = matchups.map.data.name;
    return (
      <div className="os-hero-maprankings-container">
        {this.renderModal(heroKey, heroName)}
        <div className="row">
          <MapRankingsList
            heroKey={heroKey}
            maps={mapsHash}
            matchups={matchups.map}
          />
          <div className="ow-map-new-container">
            <div className="col-lg-4">
              <div className="os-map-new">
                <button
                  className="btn btn-primary os-btn-blue"
                  data-toggle="modal"
                  data-target={`#modal-add-new-map`}
                >
                  ADD A MAP
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderModal = (heroKey, heroName) => {
    const {
      dispatch,
      token
    } = this.props;
    if(token){
      const title = `NEW MAP RANKING`;
      const description = `Add a map for ${heroName}`;
      
      return (
        <div>
          <form>
            <Modal 
              id={`modal-add-new-map`}
            >
              <fieldset className="os-modal-form-group-1">
                <h4 className="os-modal-title">{title}</h4>
                <span className="os-modal-description">{description}</span>
              </fieldset>
              <fieldset className="os-modal-form-group-2">
                <MapTypeahead
                  constructLink={(id) => `javascript:void(0)`}
                  handleMapClick={(id) => this.addMapRanking(id)}
                  inputGroupClass="input-group"
                  placeholder={"Search for a map"}
                />
              </fieldset>
              <fieldset className="os-modal-form-group-2">
                <div>
                  { this.renderMapsList( heroKey) }
                </div>
              </fieldset>
            </Modal>
          </form>
        </div>
      );
    }
  };

  addMapRanking = (id) => {
    $(`#modal-add-new-map`).modal('hide');
    const {
      params:{
        heroKey: _heroKey
      },
      dispatch,
      token
    } = this.props;
    const heroKey = changeCase.lower(_heroKey);

    if(token){
      dispatch(addHeroMatchup({
        heroKey: heroKey,
        matchupKey: id,
        type:'map',
        token
      }));
    }
  }

  renderMapsList = (heroKey) => {
    const {
      isFetchingMaps,
      mapsArray
    } = this.props;
    if(isFetchingMaps || !mapsArray) return;

    return (
      <div>
        {
          mapsArray.map(_map => {
            const {
              id,
              name: mapName,
              type: mapType,
              image: image
            } = _map;

            return (
              <Link 
                onClick={e => {this.addMapRanking(id); return false;}}
                key={id}
                className="os-map-item"
              >
                <img
                  width="75"
                  height="75"
                  className="os-map-thumb-image"
                  src={image}
                />
                <div className="os-map-info">
                  <span className="os-map-type">{changeCase.upper(MAPS_HASH[mapType])}</span>
                  <h5 className="os-map-name">{mapName}</h5>
                </div>
              </Link>   
            );
          })
        }
      </div>
    );
  }
}


function mapStateToProps (state) {
  const {
    auth: {
      token
    },
    api: {
      matchups: {
        matchups: matchupsData,
        isFetching: isFetchingMatchups
      }
    },
    map: {
      maps: {
        _hash: mapsHash,
        _array: mapsArray,
        isFetching: isFetchingMaps
      }
    }
  } = state;

  return {
    token,
    mapsHash,
    mapsArray,
    isFetchingMaps,
    matchups: matchupsData,
    isFetchingMatchups
  };
}

export default connect(mapStateToProps)(MapRankingsPage);
