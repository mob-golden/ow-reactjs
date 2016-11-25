import React from 'react';

import Loader from '../components/Loader';
import TabsNav from '../components/TabsNav';
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
} from '../../constants/urls';

import {
  generateSpriteStyle
} from '../utils/sprites';

import {
  HERO_TYPES
} from '../../constants/matchups';

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
      <div>
        <p className="hidden-xs-down os-font-size-18">Choose a hero below to find counterpicks, general counters, hero synergy, and more!</p>
        <div>
          <TabsNav
            activeTabId={'all'}
            handleClick={activeTabId => activeTabId}
            tabs={HERO_TYPES.map(type => {
              return {
                id: type,
                label: changeCase.upper(type)
              };
            })}
          />
        </div>

        <div className="os-heros-grid row">
          {heros.map(hero => {
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
                    {/* TODO: extract CSS  */}
                    {/* use transparent PNG as a placeholder */}
                    <img
                      width="98"
                      height="138"
                      className="os-thumbnail"
                      src={`${RIOT_HEROS_ICONS_URL}/${full}`}
                    />
                    <span className="os-thumb-name">{changeCase.upper(name)}</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default HerosGrid;
