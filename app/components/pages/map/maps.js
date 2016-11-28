// import Ad from 'react-google-publisher-tag';
// import React from 'react';
// import take from 'lodash/take';
// import uniqBy from 'lodash/uniqBy';

// import Loader from '../../Loader';
// import Typeahead from '../../Typeahead';
// import HerosGrid from './MapsGrid';

// import {
//   Component,
//   PropTypes
// } from 'react';

// import {
//   connect
// } from 'react-redux';


// import {
//   adDimensions
// } from '../../../constants/ads';

// import {
//   prepareAds
// } from '../../utils/index';

// class Maps extends Component {
//   static defaultProps = {
//     ads: [
//       'div-gpt-ad-1468534690919-8',
//       'div-gpt-ad-1468534690919-9'
//     ]
//   };

//   // static propTypes = {
//   //   maps: PropTypes.object.isRequired,
//   //   dispatch: PropTypes.func.isRequired,
//   //   isFetchingMaps: PropTypes.bool.isRequired
//   // };

//   componentWillMount () {
//     const {
//       ads,
//       dispatch
//     } = this.props;

//     prepareAds(ads);
//   };

//   componentWillUnmount () {
//     $('.cs-ad-side').remove();
//   }

//   render () {
//     const {
//       ads,
//       maps,
//       isFetchingMaps
//     } = this.props;

//     return (
//       <div className="container cs-content">
//         <Ad
//           className="cs-ad cs-ad-top"
//           dimensions={adDimensions.BEFORE_RECT}
//           path={'/22280732/ChampionSelect_728x90_HP_BTF1'}
//         />
//         <div className="cs-home row">
//           <div className="col-lg-12">
//             <div className="cs-home-search-div">
//               <h2 className="cs-white">CHOOSE A MAP</h2>
//               <p className="cs-white hidden-xs-down cs-font-size-18">
//                 The list below is sorted alphabetically, the maps are not ranked in any way. <br/>
//                 Choose a map below to find recommended Heros for each map.
//               </p>
//             </div>
//           </div>
//           <div className="col-lg-12">
//             <div className="cs-home-box">
//               {!isFetchingMaps && maps ?
//                 <MapsGrid
//                   maps={maps.data}
//                 /> : <Loader /> } 
//             </div>
//           </div>
          
//         </div>
//         <Ad
//           className="cs-ad cs-ad-bottom"
//           dimensions={adDimensions.AFTER_SQUARE}
//           path={'/22280732/ChampionSelect_300x250_HP_ATF1'}
//         />
//       </div>
//     );
//   }

//   onScroll = () => {
//     // fetchNextComments();
//   };
// }

// function mapStateToProps (state) {
//   const {
//     riot: {
//       maps: {
//         data: mapsData,
//         isFetching: isFetchingMaps
//       }
//     }
//   } = state;
//   return {
//     heros: mapsData,
//     isFetchingMaps
//   };
// }

// export default connect(mapStateToProps)(Maps);
