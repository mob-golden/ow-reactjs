import React from 'react';
import { Component } from 'react';
import { Link } from 'react-router';

import {
  HERO_TYPES
} from '../../../constants/types';

class HeroFooter extends Component {

  render () {
    const {
      heroes
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
                icon: image
              } = hero;

              return (
                <Link to={`/hero/${id}`} key={id}>
                  <div
                    className="os-hero-footer-thumb"
                  >
                    <img
                      width="75"
                      height="75"
                      className="os-hero-footer-thumb-img"
                      src={image}
                    />
                  </div>
                </Link>
              );
            })
          }
        </div>
      </div>
    );
  }
}

export default HeroFooter;
