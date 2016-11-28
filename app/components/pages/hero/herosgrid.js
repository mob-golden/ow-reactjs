import React from 'react';

import Loader from '../../loader';
import changeCase from 'change-case';


import {
  Component
} from 'react';

import {
  Link
} from 'react-router';

import {
  RIOT_HEROS_ICONS_URL,
  RIOT_SPRITES_URL
} from '../../../constants/urls';

import {
  generateSpriteStyle
} from '../../sprites';

import {
  HERO_TYPES
} from '../../../constants/types';

class HerosGrid extends Component {
  static defaultProps = {
    colClass: 'col-xs-3 os-col-sm-1'
  };

  render () {
    const {
      heros,
      colClass
    } = this.props;

    return (
      <div className="os-heros-grid row">
        {
          heros.map(hero => {
            const {
              id,
              key,
              name,
              image:{
                full,
                sprite
              }
            } = hero;

          return (
            <div
              className={colClass}
              key={hero.id}
            >
              <div className="os-thumb-container">
                <Link to={`/heros/${id}`}>
                  <div className="os-thumb-photo">
                    <img
                      width="98"
                      height="138"
                      className="os-thumbnail"
                      src={`${RIOT_HEROS_ICONS_URL}/${full}`}
                    />
                  </div>
                  <div className="os-thumb-name">
                    <span>{changeCase.upper(name)}</span>
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default HerosGrid;