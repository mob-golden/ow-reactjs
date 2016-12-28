import React from 'react';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  resetPassword
} from '../../../actions/auth';

const MIN_LENGTH_PASSWORD = 6;
const MAX_LENGTH_PASSWORD = 20;

class ResetPassword extends Component {
  static propTypes = {

  };

  constructor (props) {
    super(props);

    this.state = {
      password: '',
      confirmPassword: '',
      passwordMessage: null
    };
  }

  render () {
    const {
      password,
      confirmPassword,
      passwordMessage
    } = this.state;

    const {
      errorResetPassword,
      messageResetPassword,
      isResetPasswordPending
    } = this.props;

    return (
      <div className="os-reset row">
        <div className="os-reset-body">
          <h2>RESET PASSWORD</h2>
          <p>Update your password below.</p>
          {errorResetPassword && !messageResetPassword ?
            <div className="alert alert-warning">{errorResetPassword.message}</div>
            : null
          }
          {messageResetPassword ?
            <div className="alert alert-success">{messageResetPassword}</div>
            : null
          }
          <form onSubmit={this.resetPassword}>
            <div className="form-group">
              <input
                className="form-control os-modal-input"
                id="resetPassword"
                onChange={this.handleChange.bind(null, 'password')}
                pattern={`.{${MIN_LENGTH_PASSWORD},${MAX_LENGTH_PASSWORD}}`}
                placeholder="New Password"
                required
                title={`Password length must be ${MIN_LENGTH_PASSWORD} to ${MAX_LENGTH_PASSWORD} characters.`}
                type="password"
                value={password}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control os-modal-input"
                id="resetConfirmPassword"
                placeholder="Confirm new password"
                onChange={this.handleChange.bind(null, 'confirmPassword')}
                required
                type="password"
                value={confirmPassword}
              />
              {passwordMessage ?
                <small className="text-warning">{passwordMessage}</small>
                : null
              }
            </div>
            <button
              className="btn btn-primary os-btn-blue"
              disabled={isResetPasswordPending}
              type="submit">
              SUBMIT {isResetPasswordPending ?
                <i className="fa fa-fw fa-circle-o-notch fa-spin"></i>
                : null
              }
            </button>
          </form>
        </div>
      </div>
    );
  }

  handleChange = (key, e) => {
    this.setState({
      [key]: e.target.value
    });
  };

  resetPassword = e => {
    e.preventDefault();

    const {
      dispatch,
      location: {
        query: {
          token,
          user_id: userId
        }
      }
    } = this.props;

    const {
      password,
      confirmPassword
    } = this.state;

    if (password === confirmPassword) {
      dispatch(resetPassword(token, userId, password));
      this.setState({passwordMessage: null});
    } else {
      this.setState({passwordMessage: 'Passwords must match.'});
    }

    return false;
  };
}

function mapStateToProps (state) {
  const {
    auth: {
      errorResetPassword,
      messageResetPassword,
      isResetPasswordPending
    }
  } = state;

  return {
    errorResetPassword,
    messageResetPassword,
    isResetPasswordPending
  };
}

export default connect(mapStateToProps)(ResetPassword);
