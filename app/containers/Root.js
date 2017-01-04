import React from 'react';

import Header from '../components/header';
import Footer from '../components/footer';

import {
  Component,
  PropTypes
} from 'react';

import {
  connect
} from 'react-redux';

import {
  fetchHeroesIfNeeded
} from '../actions/hero';
import {
  fetchMapsIfNeeded
} from '../actions/map';


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
  }

  render () {
    const {
      children
    } = this.props;

    return (
      <div className="os-container container-fluid">
        <Header />
          {children}
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
