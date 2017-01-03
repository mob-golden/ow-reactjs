import React from 'react';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import CommunityHeader from './communityheader';
import CommunityBody from './communitybody';

class CommunityPage extends Component {
  render() {
    return (
      <div className="os-content container">
        <CommunityHeader />
        <CommunityBody />
      </div>
    );
  }
}

export default connect()(CommunityPage);
