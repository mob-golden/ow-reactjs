import React from 'react';
import Ad from 'react-google-publisher-tag';
import { adDimensions } from '../constants/ads';
import Header from '../components/header';
import Footer from '../components/footer';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchHeroesIfNeeded } from '../actions/hero';
import { fetchMapsIfNeeded } from '../actions/map';

//TODO import { updateCache } from '../actions/cache';

class Root extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };

  componentWillMount () {
    const {
      dispatch
    } = this.props;

    dispatch(fetchHeroesIfNeeded());
    dispatch(fetchMapsIfNeeded());
//TODO    dispatch(updateCache());
  }

  render () {
    const {
      children
    } = this.props;

    return (
      <div className="os-container container-fluid">
        <Header />
          <Ad
            className="os-ad-outline"
            dimensions={adDimensions.LEFT_SIDEBAR}
            path={'/22280732/OverwatchElite_336x768_ROS_Skin_Left'}
          />
          <Ad
            className="os-ad os-ad-side-right os-ad-outline"
            dimensions={adDimensions.RIGHT_SIDEBAR}
            path={'/22280732/OverwatchElite_336x769_ROS_Skin_Right'}
          />
          <div className="os-transition">
            {children}
          </div>
        <Footer />
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
  };
}

export default connect(mapStateToProps)(Root);
