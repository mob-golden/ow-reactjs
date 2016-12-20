import React from 'react';

import changeCase from 'change-case';
import { Component } from 'react';
import { Link } from 'react-router';

import {  HERO_TYPES } from '../../../constants/types';

class HeroesGrid extends Component {
  static defaultProps = {
    colClass: 'col-xs-4 os-col-sm-1'
  };

  render () {
    const {
      filter,
      heroes,
      colClass
    } = this.props;

    return (
      <div className="os-heroes-grid row">
        {
          heroes.map(hero => {
            const {
              id,
              name,
              portrait,
              type
            } = hero;

          if(filter !== 0 && filter!== type) return null;
          return (
            <div
              className={colClass}
              key={hero.id}
            >
              <div className="os-thumb-container">
                <Link to={`/heroes/${id}`}>
                  <div className="os-thumb-photo">
                    <img
                      width="98"
                      height="168"
                      className="os-thumbnail"
                      src={ portrait }
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

export default HeroesGrid;
