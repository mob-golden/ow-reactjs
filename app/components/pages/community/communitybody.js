import React from 'react';
import { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

class CommunityBody extends Component {
  render() {
    return (
      <div className="col-lg-12">
        <div className="os-content-body os-comm-body">
          <div className="os-comm-search">
            <p className="os-font-size-32 os-comm-search-text">SEARCH ALL FORUMS</p>
          </div>
          <div className="os-comm-boards">
            <div className="os-comm-boards-section">
              <div className="boards-content">
                <img src="https://s3.amazonaws.com/solomid-resources/overwatch/community/general.png" className="boards-img"/>
                <div className="boards-text">
                  <p className="boards-header os-font-size-24">GENERAL DISCUSSION</p>
                  <p className="boards-description os-font-size-14">Disscuss all things Overwatch.</p>
                </div>
              </div>
            </div>
            <div className="os-comm-boards-section">
              <div className="boards-content">
                <img src="https://s3.amazonaws.com/solomid-resources/overwatch/community/announcements.png" className="boards-img"/>
                <div className="boards-text">
                  <p className="boards-header os-font-size-24">ANNOUNCEMENTS</p>
                  <p className="boards-description os-font-size-14">Official updates for Overwatch, including news and patch notes.</p>
                </div>
              </div>
            </div>
            <div className="os-comm-boards-section">
              <div className="boards-content">
                <img src="https://s3.amazonaws.com/solomid-resources/overwatch/community/guides.png" className="boards-img"/>
                <div className="boards-text">
                  <p className="boards-header os-font-size-24">GUIDES</p>
                  <p className="boards-description os-font-size-14">Player generated guides for Overwatch.</p>
                </div>
              </div>
            </div>
            <div className="os-comm-boards-section">
              <div className="boards-content">
                <img src="https://s3.amazonaws.com/solomid-resources/overwatch/community/bugs.png" className="boards-img"/>
                <div className="boards-text">
                  <p className="boards-header os-font-size-24">BUG REPORTS</p>
                  <p className="boards-description os-font-size-14">Report gameplay issues you've experienced while playing Overwatch.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(CommunityBody);
