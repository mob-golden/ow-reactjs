import Fuse from 'fuse.js';
import React from 'react';
import classNames from 'classnames';
import { values } from 'lodash';
import { fetchAllThreadsIfNeeded } from '../actions/community';

import {
  Component,
  PropTypes
} from 'react';

import {
  connect
} from 'react-redux';

import {
  Link,
  browserHistory
} from 'react-router';

import {
  push
} from 'react-router-redux';

class CommunityTypeahead extends Component {
  static defaultProps = {
    ref: 'input'
  };

  componentWillMount () {
    const {
      dispatch
    } = this.props;
    dispatch( fetchAllThreadsIfNeeded());
  }

  constructor (props) {
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

  render () {
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
              className="btn btn-light-orange os-search-btn"
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
          {suggestions.map(_map => {
            if (this.state.areSuggestionsVisible) {
              const listGroupItemClass = classNames({
                'list-group-item': true,
                'media': true,
                'active': suggestions[selection] == _map
              });

              return (
                <Link
                  className={listGroupItemClass}
                  key={_map._id}
                  to={`/community/${_map.class[1]}/${_map._id}`}
                >
                  <div className="media-body">
                    <h6 className="media-heading">{_map.meta.title}</h6>
                  </div>
                </Link>
              );
            }

            return null;
          })}
        </div>
      );
    }
  }

  handleBlur = e => {
    this.setState({
      areSuggestionsVisible: this.state.didClickSuggestions
    });
  };

  handleChange = e => {
    const {
      threadsArray,
      isFetchingThreads
    } = this.props;

    if (!isFetchingThreads && threadsArray) {
      const query = e.target.value;
      const areSuggestionsVisible = query.length > 0 ? true : false;

      const options = {
        keys: ['meta.title'],
        threshold: 1
      };

      const threadsData = values(threadsArray);
      const fuse = new Fuse(threadsData, options);
      const suggestions = fuse.search(query);

      this.setState({
        areSuggestionsVisible,
        // TODO: cleanup
        selection: 0,
        suggestions,
        query
      });
    }

  };

  handleFocus = e => {
    this.setState({
      areSuggestionsVisible: true
    });
  };

  handleInputKeyDown = e => {
    const {
      constructLink,
      dispatch
    } = this.props;

    const {
      query,
      suggestions,
      selection
    } = this.state;

    if (e.key === 'Tab' && query.length > 0) {
      e.preventDefault();
    }

    if (suggestions && suggestions.length > 0) {
      const selected = suggestions[selection];

      if (e.key === 'Tab') {
        this.setState({
          query: selected.name
        });
      }

      if (e.key == 'Enter') {
        browserHistory.push(constructLink(selected.id));

        this.setState({
          query: '',
          areSuggestionsVisible: false,
          suggestions: []
        });
      }
    }
  };

  handleSuggestionsClick = e => {
    this.setState({
      areSuggestionsVisible: false,
      selection: 0,
      query: ''
    });
  };

  handleSuggestionsMouseDown = e => {
    this.setState({
      didClickSuggestions: true
    });
  };

  handleSuggestionsMouseUp = e => {
    this.setState({
      didClickSuggestions: false
    });
  };
}

function mapStateToProps (state) {
  const {
    community: {
      allThreads: {
        allThreads: threadsArray,
        isFetching: isFetchingThreads
      }
    }
  } = state;

  return {
    threadsArray,
    isFetchingThreads
  };
}

export default connect(mapStateToProps)(CommunityTypeahead);
