import React from 'react';
import changeCase from 'change-case';
import { Component } from 'react';
import { Link } from 'react-router';

import {  MAPS_HASH, MAP_TYPES } from '../../../constants/types';

class MapsGrid extends Component {
  static defaultProps = {
    colClass: 'col-xs-12 col-sm-6 col-lg-4'
  };

  render () {
    const {
      filter,
      maps,
      colClass
    } = this.props;

    return (
      <div className="os-maps-grid row">
        {
        maps.map(_map => {
          const {
            id,
            name,
            image,
            type
          } = _map;

          if(filter !== 'all' && filter !== MAP_TYPES[type].name) return null;
          return (
          <div
            className={colClass}
            key={_map.id}
          >
          <Link to={`/map/${id}`}>
            <div className="os-map">
              <div className="os-map-profile">
                <span className="os-map-profile-type">{changeCase.upper(MAPS_HASH[type])}</span>
                <h5 className="os-map-profile-title">{name}</h5>
                <div className="os-map-btn">
                  <Link
                    className="btn btn-primary os-btn-blue"
                    to={`/map/${id}`}
                  >
                  VIEW MAP TIPS
                  </Link>
                </div>
              </div>
              <img
                width="100%"
                height="212"
                className="os-map-image"
                src={image}
              />
            </div>
            </Link>
          </div>
          );
        })}
      </div>
    );
  }
}

export default MapsGrid;
