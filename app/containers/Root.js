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
      children
    } = this.props;

    return (
      <div className="os-container container-fluid">
          <GPT
            adUnitPath="/22280732/OverwatchElite_336x768_ROS_Skin_Left"
            slotSize={[336, 768]}
            style={{position: "absolute"}}
          />
        <div className="right-ad" style={{position: "absolute", right: "0"}}>
          <GPT
            adUnitPath="/22280732/OverwatchElite_336x768_ROS_Skin_Right"
            slotSize={[336, 769]}
          />
        </div>
        <Header />
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
