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
        <div className="col-xs-6 col-xs-offset-3">
          <h3>Forgot your password?</h3>
          <p>Enter your email address to reset your password. You may need to check your spam folder or unblock no-reply@overwatchselect.net.</p>
          <p>(It may take several minutes for the email to send.)</p>
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
              <label htmlFor="forgotEmail">Email address</label>
              <input
                className="form-control"
                id="forgotEmail"
                placeholder="Email"
                onChange={this.handleEmailChange}
                required
                type="email"
                value={email}
              />
            </div>
            <button
              className="btn btn-primary"
              disabled={isRequestPasswordChangePending}
              type="submit">
              Submit {isRequestPasswordChangePending ?
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
