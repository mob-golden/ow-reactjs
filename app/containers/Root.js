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
import { prepareAds } from '../utils/index';

class Root extends Component {
  static defaultProps = {
    ads: [
      'div-gpt-ad-1485373546813-0',
      'div-gpt-ad-1485373546813-1'
    ]
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { ads } = this.props;
    prepareAds(ads);
  }

  componentWillMount () {
    const {
      dispatch
    } = this.props;

    dispatch(fetchHeroesIfNeeded());
    dispatch(fetchMapsIfNeeded());
//TODO    dispatch(updateCache());
    $('.os-ad-side').remove();
  }

  render () {
    const {
      ads,
      location: {
        pathname
      },
      children
    } = this.props;

    return (
      <div className="os-container container-fluid">
        <Header
          currentPath={pathname}
        />
          <div className="os-ad os-ad-side os-ad-side-left" id={ads[0]}></div>
          <div className="os-ad os-ad-side os-ad-side-right" id={ads[1]}></div>
          <div className="os-transition">
            {children}
          </div>
        <Footer />
      </div>
    );
  }
}

export default connect()(Root);
