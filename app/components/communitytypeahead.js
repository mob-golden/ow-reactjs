import Fuse from 'fuse.js';
import React from 'react';
import classNames from 'classnames';
import { values } from 'lodash';

import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { push } from 'react-router-redux';

class CommunityTypeAhead extends Component {
  static defaultProps = {
    ref: 'input',
    miniTag: 'none';
  };

  constructor(props) {
    super(props);

    this.state = {
      areSuggestionsVisible: false,
      didClickSuggestions: false,
      query: '',
      suggestions: null,
      selection: 0
    };
  }

  componentDidMount () {
  }

  render() {
    const {
      inputGroupClass,
      placeholder,
      ref,
    } = this.props;

    return (
      <div
        className="os-typeahead"
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
      >
        <div className={inputGroupClass}>
          <input
            className="form-control os-search-input"
            onChange={this.handleChange}
            onKeyDown={this.handleInputKeyDown}
            placeholder={placeholder}
            ref={this.props.ref}
            type="text"
            value={this.state.query}
          />
          {this.renderSuggestions()}
          <span className="input-group-btn">
            <button
              className="btn btn-warning os-search-btn"
              type="button"
            >
              <small>SEARCH</small>
            </button>
          </span>
        </div>
      </div>
    );
  }
  renderSuggestions = () => {
    const {
      constructLink,
      handleForumClick
    } = this.props;

    const {
      selection,
      suggestions
    } = this.state;

    if (suggestions) {
      return (
        <div
          className="list-group"
          onClick={this.handleSuggestionsClick}
          onMouseDown={this.handleSuggestionsMouseDown}
          onMouseUp={this.handleSuggestionsMouseUp}
        >
          {suggestions.map(_forum => {
            if (this.state.areSuggestionsVisible) {
              const listGroupItemClass = classNames({
                'list-group-item': true,
                'media': true,
                'active': suggestions[selection] == _forum
              });

              const image = 
            }
          })}
        </div>
      )
    }
  }
}
