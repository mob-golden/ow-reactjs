import React from 'react';

import { Component,PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  requestPasswordChange
} from '../../../actions/auth';

class ForgotPassword extends Component {
  static propTypes = {

  };

  constructor (props) {
    super(props);

    this.state = {
      email: ''
    };
  }

  render () {
    const {
      errorPasswordChange,
      isRequestPasswordChangePending,
      messagePasswordChange
    } = this.props;

    const {
      email
    } = this.state;

    return (
      <div className="os-forgot row">
        <div className="os-forgot-body">
          <h2>FORGOT PASSWORD</h2>
          <p>We will send you an email to reset your password.</p>
          {errorPasswordChange ?
            <div className="alert alert-warning">{errorPasswordChange.message}</div>
            : null
          }
          {messagePasswordChange ?
            <div className="alert alert-success">{messagePasswordChange}</div>
            : null
          }
          <form onSubmit={this.requestPasswordChange}>
            <div className="form-group">
              <input
                className="form-control os-modal-input"
                id="forgotEmail"
                placeholder="Email"
                onChange={this.handleEmailChange}
                required
                type="email"
                value={email}
              />
            </div>
            <button
              className="btn btn-primary os-btn-blue"
              disabled={isRequestPasswordChangePending}
              type="submit">
              SUBMIT {isRequestPasswordChangePending ?
                <i className="fa fa-fw fa-circle-o-notch fa-spin"></i>
                : null
              }
            </button>
          </form>
        </div>
      </div>
    );
  }

  handleEmailChange = e => {
    const email = e.target.value;

    this.setState({
      email
    });
  };

  requestPasswordChange = e => {
    e.preventDefault();

    const {
      dispatch
    } = this.props;

    const {
      email
    } = this.state;

    dispatch(requestPasswordChange(email));

    return false;
  };
}

function mapStateToProps (state) {
  const {
    auth: {
      errorPasswordChange,
      messagePasswordChange,
      isRequestPasswordChangePending
    }
  } = state;

  return {
    errorPasswordChange,
    messagePasswordChange,
    isRequestPasswordChangePending
  };
}

export default connect(mapStateToProps)(ForgotPassword);
