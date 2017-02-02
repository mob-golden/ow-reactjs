import React from 'react';
import Modal from './modal';
import moment from 'moment';
import classNames from 'classnames';

import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { browserHistory, Router, Route, Link } from 'react-router';

import {
  setUser,
  signIn,
  signOut,
  signUp,
  checkSession
} from '../actions/auth';

const MAX_LENGTH = 20;
const MIN_LENGTH = 3;
const MIN_LENGTH_PASSWORD = 6;

class Header extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    token: PropTypes.string,
    username: PropTypes.string
  }
  static defaultProps = {
    signInId: 'sign-in',
    signUpId: 'sign-up'
  };

  constructor (props) {
    super(props);

    this.updateLocalStorage();
    const {
      token,
      username
    } = props;

    this.state = {
      email: '',
      password: '',
      username: '',
      confirmPassword: '',
      passwordMessage: null,
      dropdownOpen: false
    };
  }

  componentDidUpdate (prevProps) {
    const {
      token,
      signInId,
      signUpId
    } = this.props;

    const {
      token: oldToken
    } = prevProps;

    // Logged in
    if (!oldToken && token) {
      $(`#${signInId}`).modal('hide');
      $(`#${signUpId}`).modal('hide');

      this.setState({
        email: '',
        password: '',
        username: '',
        confirmPassword: ''
      });
    }
  }

  componentDidMount () {
    const {
      dispatch,
      token,
      username,
      userId
    } = this.props;
    dispatch(checkSession());
    if (!token && !username && !userId) {
      const localToken = localStorage.getItem('token');
      const localUsername = localStorage.getItem('username');
      const localUserId = localStorage.getItem('userId');

      if (localToken && localUsername && localUserId) dispatch(setUser(localToken, localUsername, localUserId));
    }

    // This closes the dropdown when a menu item is clicked
    $(".os-mobile-link").click(() => {
      if (this.state.dropdownOpen) this.toggleDropdown();
      $(window).scrollTop(0);
    })
  }

  updateLocalStorage(){
    let tipVotes = JSON.parse(localStorage.getItem('tipVotes'));
    let matchupVotes = JSON.parse(localStorage.getItem('matchupVotes'));

    const current = moment();

    if(tipVotes){
      for (var key in tipVotes) {
        if (tipVotes.hasOwnProperty(key)) {
          const votedDate = moment(parseInt(tipVotes[key].split(' ')[1]));
          if(current.diff(votedDate, 'hours') > 23){
            delete tipVotes[key];
          }
        }
      }
      localStorage.setItem('tipVotes', JSON.stringify(tipVotes));
    }

    if(matchupVotes){
      for (var key in matchupVotes) {
        if (matchupVotes.hasOwnProperty(key)) {
          const votedDate = moment(parseInt(matchupVotes[key].split(' ')[1]));
          if(current.diff(votedDate, 'hours') > 23){
            delete matchupVotes[key];
          }
        }
      }
      localStorage.setItem('matchupVotes', JSON.stringify(matchupVotes));
    }
  }

  toggleDropdown () {
    $('.navbar').toggleClass('nav-open');
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
    return;
  }


  render () {
    const {
      signInId,
      signUpId,
      token,
      username
    } = this.props;

    return (
      <header className="os-header navbar-fixed row">
        {this.renderModals()}
        <nav className="os-nav navbar navbar-full navbar-light navbar-fixed-top">
          <div className="container">
            <div className="row">
              <div className="col-xl-7 col-lg-6 col-xs-12">
                <Link
                  className="navbar-brand os-white os-nav-title"
                  to="/"
                >
                  <img style={{width: "200px"}} src="https://s3.amazonaws.com/solomid-resources/overwatch/icons/overwatchelite-logo.png" />
                </Link>
              </div>
              <div className="col-xl-5 col-lg-6 col-xs-12">
                <div className="row os-nav-menu">
                  {this.renderLinks()}
                </div>
              </div>
              <a
                className="mobile-link"
                onClick={() => this.toggleDropdown()}
              >
                <span className="mobile-hamburger"></span>
              </a>
              <div className="navigation nav-right">
                {this.renderMobileLinks()}
              </div>
            </div>
        <div
          className="header--dropdown-toggle-bg hidden"
          onClick={() => this.toggleDropdown()}
        ></div>
          </div>
        </nav>
        <nav className="os-nav-lg-down navbar navbar-full navbar-light bg-faded hidden-lg-up">
          {this.renderLinks('nav navbar-nav')}
        </nav>
      </header>
    );
  }

  renderModals = () => {
    const {
      signInId,
      signUpId,
      errorSignIn,
      errorSignUp
    } = this.props;

    const {
      email,
      password,
      username,
      confirmPassword,
      passwordMessage
    } = this.state;

    return (
      <div>
        <form onSubmit={this.signIn}>
          <Modal
            id={signInId}
          >
            <fieldset className="os-modal-form-group-1">
              <h4 className="os-modal-title">LOG IN</h4>
              <span className="os-modal-description">You can login with your SoloMid Account.</span>
              {errorSignIn ? <div className="alert alert-warning">{errorSignIn.message}</div> : null}
            </fieldset>

            <fieldset className="os-modal-form-group-2">
              <input
                className="form-control os-modal-input"
                id="email"
                onChange={this.handleEmailChange}
                placeholder="Email"
                required
                type="email"
                value={email}
              />
            </fieldset>
            <fieldset className="os-modal-form-group-2">
              <input
                className="form-control os-modal-input"
                id="password"
                onChange={this.handlePasswordChange}
                placeholder="Password"
                required
                type="password"
                value={password}
              />
            </fieldset>

            <fieldset className="os-modal-form-group-3">
              <button
                className="btn btn-primary os-modal-btn"
                type="submit"
              >LOG IN</button>
              <Link
                className="os-modal-forgot-pwd-link"
                onClick={e => {
                  $(`#${signInId}`).modal('hide');
                }}
                to="/forgot"
              ><small>Forgot password?</small></Link>
            </fieldset>
            <fieldset className="os-modal-form-group-4">
              <small>Don't have an account? Register
                <Link
                  className="os-modal-here-link"
                  onClick={e => {
                    $(`#${signInId}`).modal('hide');
                    $(`#${signUpId}`).modal('show');
                  }}
                > here
                </Link>.
              </small>
            </fieldset>
          </Modal>
        </form>

        <form onSubmit={this.signUp}>
          <Modal
            id={signUpId}
            text="Sign up for a SoloMid account"
          >
            <fieldset className="os-modal-form-group-1">
              <h4 className="os-modal-title">SIGN UP</h4>
              <span className="os-modal-description">Sign up for a SoloMid account.</span>
              {errorSignUp ? <div className="alert alert-warning">{errorSignUp.message}</div> : null}
            </fieldset>
            <fieldset className="os-modal-form-group-2">
              <input
                className="form-control os-modal-input"
                id="username"
                onChange={this.handleUsernameChange}
                pattern={`.{${MIN_LENGTH},${MAX_LENGTH}}`}
                placeholder="Username"
                required
                title={`Username length must be ${MIN_LENGTH} to ${MAX_LENGTH} characters`}
                type="text"
                value={username}
              />
            </fieldset>
            <fieldset className="os-modal-form-group-2">
              <input
                className="form-control os-modal-input"
                id="email"
                placeholder="Email"
                onChange={this.handleEmailChange}
                required
                type="email"
                value={email}
              />
            </fieldset>
            <fieldset className="os-modal-form-group-2">
              <input
                className="form-control os-modal-input"
                id="password"
                onChange={this.handlePasswordChange}
                pattern={`.{${MIN_LENGTH_PASSWORD},${MAX_LENGTH}}`}
                placeholder="Password"
                required
                title={`Password length must be ${MIN_LENGTH_PASSWORD} to ${MAX_LENGTH} characters`}
                type="password"
                value={password}
              />
            </fieldset>
            <fieldset className="os-modal-form-group-2">
              <input
                className="form-control os-modal-input"
                id="confirmPassword"
                pattern="*"
                onChange={this.handleConfirmPasswordChange}
                placeholder="Confirm password"
                type="password"
                value={confirmPassword}
              />
              {passwordMessage ?<small className="text-warning">{passwordMessage}</small> : null}
            </fieldset>

            <fieldset className="os-modal-form-group-3">
              <button
                className="btn btn-primary os-modal-btn"
                type="submit"
              >SIGN UP</button>
            </fieldset>
            <fieldset className="os-modal-form-group-4">
              <small>Already have an account? Log
                <Link
                  className="os-modal-here-link"
                  onClick={e => {
                    $(`#${signUpId}`).modal('hide');
                    $(`#${signInId}`).modal('show');
                  }}
                  to="/login"
                > here
                </Link>.
              </small>
            </fieldset>
          </Modal>
        </form>
      </div>
    );
  };

  renderMobileLinks = () => {
    const {
      signInId,
      signUpId,
      token,
      username
    } = this.props;
    if (token && username) {
      return (
        <ul>
          <li>
            <Link className="os-mobile-link" to="/heroes">Heroes</Link>
          </li>
          <li>
            <Link className="os-mobile-link" to="/maps">Maps</Link>
          </li>
          <li>
            <Link className="os-mobile-link" to="/community">Community</Link>
          </li>
          <li className="os-mobile-link">
            <a
              className="os-white os-font-size-12"
              href="javascript:;"
            >{username}</a>
          </li>
          <li className="os-mobile-link">
            <a
              className="os-white os-font-size-12"
              href="javascript:;"
              onClick={this.signOut}
            >Log out</a>
          </li>
        </ul>
      );
    }

    return (
      <ul>
        <li>
          <Link className="os-mobile-link" to="/heroes">Heroes</Link>
        </li>
        <li>
          <Link className="os-mobile-link" to="/maps">Maps</Link>
        </li>
        <li>
          <Link className="os-mobile-link" to="/community">Community</Link>
        </li>
        <li>
          <a
            className="os-mobile-link"
            data-toggle="modal"
            data-target={`#${signInId}`}
            href="javascript:;"
          >
            LOG IN
          </a>
        </li>
        <li>
          <a
            className="os-mobile-link"
            data-toggle="modal"
            data-target={`#${signUpId}`}
            href="javascript:;"
          >
            SIGN UP
          </a>
        </li>
      </ul>
    );
  }

  renderLinks = (classes = 'os-nav-links nav navbar-nav navbar-desktop') => {
    const {
      signInId,
      signUpId,
      token,
      username,
    } = this.props;

    const currentPath = window.location.pathname.split('/')[1];
    const isActiveHeroes = currentPath == 'heroes' || currentPath == 'hero' || currentPath == 'matchuptips' || currentPath == '';
    const isActiveMaps = currentPath == 'maps' || currentPath == 'map';
    const isActiveCommunity = currentPath == 'community';

    const navItemClass = classNames({
      "nav-item": true,
      "os-nav-item": true,
    })

    const activeNavItemClass = classNames({
      "nav-item": true,
      "os-nav-item": true,
      "os-nav-item-active": true,
    });

    if (token && username) {
      return (
        <div>
          <ul className={`${classes}`}>
            <li className={isActiveHeroes ? activeNavItemClass : navItemClass}>
              <Link
                className="os-white os-font-size-12"
                to="/heroes"
              >
                HEROES
              </Link>
            </li>

            <li className={isActiveMaps ? activeNavItemClass : navItemClass}>
              <Link
                className="os-white os-font-size-12"
                to="/maps"
              >
                MAPS
              </Link>
            </li>

            <li className={isActiveCommunity ? activeNavItemClass : navItemClass}>
              <Link
                className="os-white os-font-size-12"
                to="/community"
              >
                COMMUNITY
              </Link>
            </li>

            <li className="nav-item os-nav-item">
              <a
                className="os-white os-font-size-12"
                href="javascript:;"
              >{username}</a>
            </li>

            <li className="nav-item os-nav-item">
              <a
                className="os-white os-font-size-12"
                href="javascript:;"
                onClick={this.signOut}
              >Log out</a>
            </li>

            <div id="nav-item-back"/>
          </ul>
        </div>
      );
    }

    return (
      <div>
        <ul className={`${classes}`}>
          <li className={isActiveHeroes ? activeNavItemClass : navItemClass}>
            <Link
              className="os-white os-font-size-12"
              to="/heroes"
            >
              HEROES
            </Link>
          </li>

          <li className={isActiveMaps ? activeNavItemClass : navItemClass}>
            <Link
              className="os-white os-font-size-12"
              to="/maps"
            >
              MAPS
            </Link>
          </li>

          <li className={isActiveCommunity ? activeNavItemClass : navItemClass}>
            <Link
              className="os-white os-font-size-12"
              to="/community"
            >
              COMMUNITY
            </Link>
          </li>

          <li className="nav-item os-nav-item">
            <a
              className="os-white os-font-size-12"
              data-toggle="modal"
              data-target={`#${signInId}`}
              href="javascript:;"
            >
              LOG IN
            </a>
          </li>

          <li className="nav-item os-nav-item">
            <a
              className="os-white os-font-size-12"
              data-toggle="modal"
              data-target={`#${signUpId}`}
              href="javascript:;"
            >
              SIGN UP
            </a>
          </li>
          
          <div id="nav-item-back"/>
        </ul>

      </div>
    );
  };

  signUp = e => {
    e.preventDefault();

    const {
      dispatch
    } = this.props;

    const {
      email,
      password,
      username,
      confirmPassword,
    } = this.state;

    if (password === confirmPassword) {
      dispatch(signUp(email, password, username));
      this.setState({passwordMessage: null})
    } else {
      this.setState({passwordMessage: 'Passwords must match.'})
    }

    return false;
  };

  signIn = e => {
    e.preventDefault();

    const {
      dispatch
    } = this.props;

    const {
      email,
      password
    } = this.state;

    dispatch(signIn(email, password));

    return false;
  };

  signOut = e => {
    e.preventDefault();

    const {
      dispatch
    } = this.props;

    dispatch(signOut());
  };

  handleEmailChange = e => {
    const email = e.target.value;

    this.setState({
      email
    });
  };

  handlePasswordChange = e => {
    const password = e.target.value;

    this.setState({
      password
    });
  };

  handleUsernameChange = e => {
    const username = e.target.value;

    this.setState({
      username
    });
  };

  handleConfirmPasswordChange = e => {
    const confirmPassword = e.target.value;

    this.setState({
      confirmPassword
    });
  };
}

function mapStateToProps (state) {
  const {
    auth: {
      isPendingSignIn,
      isPendingSignUp,
      token,
      username,
      userId,
      errorSignIn,
      errorSignUp
    }
  } = state;

  return {
    isPendingSignIn,
    isPendingSignUp,
    token,
    username,
    userId,
    errorSignIn,
    errorSignUp
  };
}

export default connect(mapStateToProps)(Header);
