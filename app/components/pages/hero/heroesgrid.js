import React from 'react';

import changeCase from 'change-case';
import { Component } from 'react';
import { Link } from 'react-router';

import {  HERO_TYPES } from '../../../constants/types';

class HeroesGrid extends Component {
  static defaultProps = {
    colClass: 'col-xs-4 col-md-2 os-col-sm-1'
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

          if(filter !== 'all' && filter !== HERO_TYPES[type].name) return null;
          return (
            <div
              className={colClass}
              key={hero.id}
            >
              <div className="os-thumb-container">
                <Link to={`/hero/${id}`}>
                  <div className="os-thumb-photo">
                    <div className="os-thumbnail-wrapper">
                      <div
                        className="os-thumbnail"
                        style={{
                          background: `url(${portrait}) no-repeat center center`,
                          backgroundSize: "cover",
                          // width: "98px",
                          height: "168px"
                        }}
                      ></div>
                    </div>
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
