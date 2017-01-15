import React from 'react';
import {Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class pageNotFound extends Component {
  render() {
    return (
      <div className="os-content container">
        <div className="col-lg-12">
          <div className="os-content-body">
            <div className="error">
              <div className="error-container">

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(pageNotFound);
