import React from 'react';
import {Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';


class pageNotFound extends Component {
  render() {
    return (
      <div className="os-content container">
        <div className="col-lg-12">
          <div className="os-content-body os-error">
            <div className="os-card os-card--pagenotfound">
              <div className="os-error--content">
                <div className="os-card--pagenotfound-left os-error--half">
                  <h2 className="os-card--pagenotfound-header">Sorry, the page you're looking for doesn't exist</h2>
                  <p className="os-card--pagenotfound-text">Please head back to our home page</p>
                  <Link 
                    className="btn btn-primary os-btn-blue"
                    to="/"
                  >
                    Go Home
                  </Link>
                </div>
                <img 
                  className="os-error--half-right os-error--bastion"
                  src="https://s3.amazonaws.com/solomid-resources/overwatch/404/bastion-404.png"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(pageNotFound);
