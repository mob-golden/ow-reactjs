import React from 'react';

import Header from '../src/layout/header';
import Footer from '../src/layout/footer';

import {
  Component,
  PropTypes
} from 'react';

import {
  connect
} from 'react-redux';

import {
  fetchHerosIfNeeded
} from '../actions/riot';

class Root extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };

  componentWillMount () {
    const {
      dispatch
    } = this.props;

    dispatch(fetchHerosIfNeeded());
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
