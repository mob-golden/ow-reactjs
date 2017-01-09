import React from 'react';
import { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

class CommunityHeader extends Component {
  startDiscussion (e) {
    $('html, body').animate({ 
       scrollTop: $(document).height()-$(window).height()}, 
       600
    );  
  }
  render() {
    return (
      <div className="row">
        <div className="col-lg-12">
          <div className="os-content-top os-comm-header">
            <p className="os-white os-font-size-30 os-comm-welcome">Welcome to the SoloMid</p>
            <p className="os-white os-font-size-45 os-comm-big">OVERWATCH COMMUNITY</p>
            <button 
              className="btn btn-warning btn-comm"
              onClick={(e) => {this.startDiscussion(e)}}
            >
              <small>START A DISCUSSION</small>
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(CommunityHeader);
