import Ad from 'react-google-publisher-tag';
import React from 'react';
import take from 'lodash/take';
import uniqBy from 'lodash/uniqBy';
import changeCase from 'change-case';

import Loader from '../../loader';
import Typeahead from '../../typeahead';
import TabsNav from '../../tabsnav';
import MapsGrid from './mapsgrid';

import {
  Component,
  PropTypes
} from 'react';

import {
  connect
} from 'react-redux';

import {
  adDimensions
} from '../../../constants/ads';

import {
  prepareAds
} from '../../ads';
import { MAP_TYPES } from '../../../constants/types';

const _maps = [
  {
    id: "anubis",
    image:{
      url: "https://s3.amazonaws.com/solomid-resources/overwatch/maps/anubis/tile.jpg"
    },
    type: "escort",
    name: "Temple of Anubis"
  },
  {
    id: "dorado",
    image:{
      url: "https://s3.amazonaws.com/solomid-resources/overwatch/maps/dorado/tile.jpg"
    },
    type: "assault",
    name: "Dorado"
  },
  {
    id: "eichenwalde",
    image:{
      url: "https://s3.amazonaws.com/solomid-resources/overwatch/maps/eichenwalde/tile.jpg"
    },
    type: "hybrid",
    name: "Eichenwalde"
  },
  {
    id: "gibraltar",
    image:{
      url: "https://s3.amazonaws.com/solomid-resources/overwatch/maps/gibraltar/tile.jpg"
    },
    type: "control",
    name: "Gibraltar"
  },
  {
    id: "hanamura",
    image:{
      url: "https://s3.amazonaws.com/solomid-resources/overwatch/maps/hanamura/tile.jpg"
    },
    type: "assault",
    name: "Hanamura"
  },
  {
    id: "hollywood",
    image:{
      url: "https://s3.amazonaws.com/solomid-resources/overwatch/maps/hollywood/tile.jpg"
    },
    type: "escort",
    name: "Hollywood"
  },
  {
    id: "numbani",
    image:{
      url: "https://s3.amazonaws.com/solomid-resources/overwatch/maps/numbani/tile.jpg"
    },
    type: "escort",
    name: "Numbani"
  },
  {
    id: "route66",
    image:{
      url: "https://s3.amazonaws.com/solomid-resources/overwatch/maps/route66/tile.jpg"
    },
    type: "hybrid",
    name: "Route 66"
  },
  {
    id: "voskaya_industry",
    image:{
      url: "https://s3.amazonaws.com/solomid-resources/overwatch/maps/voskaya_industry/tile.jpg"
    },
    type: "assault",
    name: "Voskaya Industry"
  }
];

class MapsPage extends Component {
  static defaultProps = {
    ads: [
      'div-gpt-ad-1468534690919-8',
      'div-gpt-ad-1468534690919-9'
    ]
  };

  // static propTypes = {
  //   maps: PropTypes.object.isRequired,
  //   dispatch: PropTypes.func.isRequired,
  //   isFetchingMaps: PropTypes.bool.isRequired
  // };

  componentWillMount () {
    const {
      ads,
      dispatch
    } = this.props;

    prepareAds(ads);
  };

  componentWillUnmount () {
    $('.os-ad-side').remove();
  }

  render () {
    const {
      ads,
      maps,
      isFetchingMaps
    } = this.props;

    return (
      <div className="container os-content">
        <Ad
          className="os-ad os-ad-top"
          dimensions={adDimensions.BEFORE_RECT}
          path={'/22280732/ChampionSelect_728x90_HP_BTF1'}
        />
        <div className="os-maps row">
          <div className="col-lg-12">
            <div className="os-maps-top">
              <h2 className="os-white">CHOOSE A MAP</h2>
              <p className="os-white hidden-xs-down os-font-size-18">
                The list below is sorted alphabetically, the maps are not ranked in any way. <br/>
                Choose a map below to find recommended Heros for each map.
              </p>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="os-maps-body">
              <div>
                <TabsNav
                  activeTabId={'all'}
                  handleClick={activeTabId => activeTabId}
                  tabs={MAP_TYPES.map(type => {
                    return {
                      id: type,
                      label: changeCase.upper(type)
                    };
                  })}
                />
              </div>
              {/* !isFetchingMaps && maps ? */
                <MapsGrid
                  maps={/*maps.data*/_maps}
                /> /*: <Loader />*/ } 
            </div>
          </div>
          
        </div>
        <Ad
          className="os-ad os-ad-bottom"
          dimensions={adDimensions.AFTER_SQUARE}
          path={'/22280732/ChampionSelect_300x250_HP_ATF1'}
        />
      </div>
    );
  }

  onScroll = () => {
    // fetchNextComments();
  };
}

function mapStateToProps (state) {
  const {
    riot: {
      heros: {
        data: mapsData,
        isFetching: isFetchingMaps
      }
    }
  } = state;
  return {
    heros: mapsData,
    isFetchingMaps
  };
}

export default connect(mapStateToProps)(MapsPage);
