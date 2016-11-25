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
  RIOT_HERO_ICONS_URL,
  RIOT_SPRITES_URL
} from '../../constants/urls';

import {
  cleanHeroKey
} from '../utils/index';

import {
  generateSpriteStyle
} from '../utils/sprites';


import {
  HERO_TYPES
} from '../../constants/matchups';

class HerosGrid extends Component {
  static defaultProps = {
    colClass: 'col-xs-3 col-sm-2'
  };

  render () {
    const {
      heros,
      herosMap,
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
              key
            } = hero;

            const cleanedKey = cleanHeroKey(key);

            const {
              image: {
                full
              },
              name
            } = herosMap[cleanedKey];

            const thumbnailStyle = {
              backgroundImage: `url("${RIOT_HERO_ICONS_URL}/${full}")`
            };

            return (
              <div
                className={colClass}
                key={hero.id}
              >
                <div className="os-heros-grid-cell os-thumbnail-container">
                  <Link to={`/heros/${cleanedKey}`}>
                    {/* TODO: extract CSS  */}
                    {/* use transparent PNG as a placeholder */}
                    <img
                      className="os-thumbnail"
                      style={thumbnailStyle}
                      src="https://upload.wikimedia.org/wikipedia/commons/c/ca/1x1.png"
                    />
                    <span className="os-heros-grid-overlay">{name}</span>
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
