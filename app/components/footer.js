import React from 'react';

import { Component } from 'react';

import { connect } from 'react-redux';

class Footer extends Component {
  render () {
    return (
      <div className="os-footer row">
        <div className="col-lg-12 os-footer-row os-footer-logo-row">
          <img style={{width: "123px"}}src="https://s3.amazonaws.com/solomid-resources/overwatch/icons/solomid-logo.png"/>
        </div>
        <div className="col-lg-12 os-footer-row">
          <div className="os-footer-block">
            <ul className="navbar-nav list-unstyled os-footer-ul">
              <li className="nav-item">
                <a
                  className="os-white"
                  href="http://solomid.net/info/tos"
                  target="_blank"
                >TERMS OF SERVICE</a>
              </li>
              <li className="nav-item">
                <a
                  className="os-white"
                  href="http://solomid.net/info/privacy"
                  target="_blank"
                >PRIVACY POLICY</a>
              </li>
              <li className="nav-item">
                <a
                  className="os-white"
                  href="http://solomid.net/info/contact"
                  target="_blank"
                >CONTACT US</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-lg-12 os-footer-row os-gray">
          <p><small>
            Copyright © 2009-2017 SoloMid.
              <span className="hidden-sm-down">&nbsp;&nbsp;</span>
              <br className="hidden-md-up" />
            All Rights Reserved.
          </small></p>
        </div>
      </div>
    );
  }
}

export default connect()(Footer);
