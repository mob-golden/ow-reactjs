// import React from 'react';

// import Loader from '../../Loader';
// import TabsNav from '../../TabsNav';
// import changeCase from 'change-case';


// import {
//   Component
// } from 'react';

// import {
//   Link
// } from 'react-router';

// import {
//   RIOT_HERO_ICONS_URL,
//   RIOT_SPRITES_URL
// } from '../../constants/urls';

// import {
//   generateSpriteStyle
// } from '../utils/sprites';

// import {
//   MAP_TYPES
// } from '../../constants/types';

// class MapsGrid extends Component {
//   static defaultProps = {
//     colClass: 'col-xs-3 col-sm-2'
//   };

//   render () {
//     const {
//       maps,
//       colClass
//     } = this.props;

//     return (
//       <div>
//         <p className="hidden-xs-down os-font-size-18">Choose a hero below to find counterpicks, general counters, hero synergy, and more!</p>
//         <div>
//           <TabsNav
//             activeTabId={'all'}
//             handleClick={activeTabId => activeTabId}
//             tabs={MAP_TYPES.map(type => {
//               return {
//                 id: type,
//                 label: changeCase.upper(type)
//               };
//             })}
//           />
//         </div>

//         <div className="os-maps-grid row">
//           <h4>TO DO:</h4>
//           <p>MAPS LIST HERE</p>
//         </div>
//       </div>
//     );
//   }
// }

// export default MapsGrid;
