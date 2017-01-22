import Fuse from 'fuse.js';
import React from 'react';
import classNames from 'classnames';
import { values } from 'lodash';

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

class Typeahead extends Component {
  static defaultProps = {
    ref: 'input'
  };

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
      ref
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
      constructLink,
      handleHeroClick
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
          {suggestions.map(hero => {
            if (this.state.areSuggestionsVisible) {
              const listGroupItemClass = classNames({
                'list-group-item': true,
                'media': true,
                'active': suggestions[selection] == hero
              });

              const image = hero.icon;

              const spriteStyle = {
                backgroundImage: `url(${image})`,

                // TODO: abstract
                // icons will be shrunk to 2/3 of their original size
                backgroundPosition: `-${image.x / 1.5}px -${image.y / 1.5}px`
              };

              return (
                <Link
                  className={listGroupItemClass}
                  key={hero.id.toLowerCase()}
                  to={handleHeroClick? null: constructLink(hero.id)}
                  onClick={handleHeroClick?  e => {handleHeroClick(hero.id); return false; } : null}
                >
                  <div className="media-left media-middle">
                    <div
                      className="media-object"
                      style={spriteStyle}
                    >
                    </div>
                  </div>
                  <div className="media-body">
                    <h6 className="media-heading">{hero.name}</h6>
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
      heroesArray,
      isFetchingHeroes
    } = this.props;

    if (!isFetchingHeroes && heroesArray) {
      const query = e.target.value;
      const areSuggestionsVisible = query.length > 0 ? true : false;

      const options = {
        keys: ['name'],
        threshold: 0.1
      };

      const heroesData = values(heroesArray);
      const fuse = new Fuse(heroesData, options);
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
    hero: {
      heroes: {
        _array: heroesArray,
        isFetching: isFetchingHeroes
      }
    }
  } = state;

  return {
    heroesArray,
    isFetchingHeroes
  };
}

export default connect(mapStateToProps)(Typeahead);
