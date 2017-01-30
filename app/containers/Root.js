import React from 'react';
import {Bling as GPT} from "react-gpt";
import { adDimensions } from '../constants/ads';
import Header from '../components/header';
import Footer from '../components/footer';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchHeroesIfNeeded } from '../actions/hero';
import { fetchMapsIfNeeded } from '../actions/map';

//TODO import { updateCache } from '../actions/cache';
import { prepareAds } from '../utils/index';

GPT.enableSingleRequest();

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
      ads,
      location: {
        pathname
      },
      children
    } = this.props;

    return (
      <div className="os-container container-fluid">
        <Header currentPath={pathname} />
          <GPT
            adUnitPath="/22280732/OverwatchElite_336x768_ROS_Skin_Left"
            slotSize={[336, 768]}
            style={{position: "absolute"}}
          />
          <GPT
            adUnitPath="/22280732/OverwatchElite_336x768_ROS_Skin_Right"
            slotSize={[336, 769]}
          />
          <div className="os-transition">
            {children}
          </div>
        <Footer />
      </div>
    );
  }
}

export default connect()(Root);
