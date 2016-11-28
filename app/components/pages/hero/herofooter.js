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

class HeroFooter extends Component {
  // static defaultProps = {
  //   colClass: 'col-xs-3 os-col-sm-1'
  // };

  render () {
    const {
      heros,
      colClass
    } = this.props;

    return (
      <div className="container">
        <div className="os-hero-footer-text">
          <p>Select another Hero below to find counterpicks, general hero synergy, and more!</p>
        </div>
        <div className="os-hero-footer-thumbs">
          {
            heros.map(hero => {
              const {
                id,
                image:{
                  full,
                }
              } = hero;

            return (
              <div
                className="os-hero-footer-thumb"
                key={hero.id}
              >
                <Link to={`/heros/${id}`}>
                  <img
                    width="75"
                    height="75"
                    className="os-hero-footer-thumb-img"
                    src={`${RIOT_HEROS_ICONS_URL}/${full}`}
                  />
                </Link>   
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default HeroFooter;
