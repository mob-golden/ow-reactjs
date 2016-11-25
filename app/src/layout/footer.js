import React from 'react';

import {
  Component
} from 'react';

import {
  connect
} from 'react-redux';

class Footer extends Component {
  render () {
    return (
      <div className="os-footer row">
        <div className="col-lg-12 os-footer-row os-footer-logo-row">
          <img src="logo-large.png"/>
        </div>
        <div className="col-lg-12 os-footer-row">
          <div className="os-footer-block">
            <ul className="navbar-nav list-unstyled os-footer-ul">
              <li className="nav-item">
                <a
                  className="os-white"
                  href="http://solomid.net/info/tos"
                  target="_blank"
                >Terms of Service</a>
              </li>
              <li className="nav-item">
                <a
                  className="os-white"
                  href="http://solomid.net/info/privacy"
                  target="_blank"
                >Privacy Policy</a>
              </li>
              <li className="nav-item">
                <a
                  className="os-white"
                  href="http://solomid.net/info/contact"
                  target="_blank"
                >Contact Us</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-lg-12 os-footer-row os-gray">
          <p><small>Copyright © 2009-2016 SoloMid.  All Rights Reserved.</small></p>
        </div>
      </div>
    );
  }
}

function mapStateToProps (state, ownProps) {
  const {
    params
  } = ownProps;

  return {
    router: ownProps
  };
}

export default connect(mapStateToProps)(Footer);
