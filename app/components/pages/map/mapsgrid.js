import React from 'react';
import changeCase from 'change-case';

import {
  Component
} from 'react';

import {
  Link
} from 'react-router';

import {
  RIOT_HERO_ICONS_URL,
  RIOT_SPRITES_URL
} from '../../../constants/urls';


class MapsGrid extends Component {
  static defaultProps = {
    colClass: 'col-xs-3 col-sm-2 col-lg-4'
  };

  render () {
    const {
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
            type,
            image:{
              url
            }
          } = _map;
          return (
          <div
            className={colClass}
            key={_map.id}
          >
            <div className="os-map">
              <div className="os-map-profile">
                <span className="os-map-profile-type">{changeCase.upper(type)}</span>
                <h5 className="os-map-profile-title">{name}</h5>
                <div className="os-map-btn">
                  <Link
                    className="btn btn-primary os-btn-blue"
                    to={`/maps/${id}`}
                  >
                  VIEW MAP TIPS
                  </Link>
                </div>
              </div>
              <img
                width="100%"
                height="212"
                className="os-map-image"
                src={url}
              />
            </div>
          </div>
          );
        })}
      </div>
    );
  }
}

export default MapsGrid;
