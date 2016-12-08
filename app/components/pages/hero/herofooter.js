import React from 'react';
import { Component } from 'react';
import { Link } from 'react-router';
import changeCase from 'change-case';

import Loader from '../../loader';

import {
  RIOT_HERO_ICONS_URL,
  RIOT_SPRITES_URL
} from '../../../constants/urls';

import {
  generateSpriteStyle
} from '../../../utils/sprites';

import {
  HERO_TYPES
} from '../../../constants/types';

class HeroFooter extends Component {
  // static defaultProps = {
  //   colClass: 'col-xs-3 os-col-sm-1'
  // };

  render () {
    const {
      heroes,
      colClass
    } = this.props;

    return (
      <div className="container">
        <div className="os-hero-footer-text">
          <p>Select another Hero below to find counterpicks, general hero synergy, and more!</p>
        </div>
        <div className="os-hero-footer-thumbs">
          {
            heroes.map(hero => {
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
                <Link to={`/heroes/${id}`}>
                  <img
                    width="75"
                    height="75"
                    className="os-hero-footer-thumb-img"
                    src={`${RIOT_HERO_ICONS_URL}/${full}`}
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
