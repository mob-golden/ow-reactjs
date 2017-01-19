import React from 'react';
import { RouteTransition } from 'react-router-transition';
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
