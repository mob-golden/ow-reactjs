import React from 'react';
import changeCase from 'change-case';
import classNames from 'classnames';
import { take, toArray, findIndex } from 'lodash';

import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { voteMatchup } from '../../../actions/all';
import { RIOT_HERO_ICONS_URL, RIOT_SPRITES_URL } from '../../../constants/urls';


class HeroMatchupsList extends Component {
  static defaultProps: {
    shouldHideMeta: false
  }

  render () {
    const {
      heroKey,
      heroesMap,
      matchups,
      shouldHideMeta
    } = this.props;

    if (matchups.data.matchups.length === 0) {
      return (
        <div className="os-counter-matchups-list">
          <div className="alert alert-warning">No matchups!</div>
        </div>
      );
    }
    const matchupsData = take(matchups.data.matchups,6);

    if (!localStorage.getItem('matchupVotes')) localStorage.setItem('matchupVotes', JSON.stringify({}));
    const votes =  JSON.parse(localStorage.getItem('matchupVotes'));
    
    return (
      <div className="os-matchups-list">
      {
        matchupsData.map(matchup => {
          const {
            score:{
              total: score,
              downvotes,
              upvotes
            },
            type,
            opponent: matchupHeroKey,
          } = matchup;

          const {
            portrait,
            name
          } = heroesMap[matchupHeroKey];

          const key = matchupHeroKey + type;

          const downvoteClass = classNames({
            'fa fa-fw': true,
            'fa-thumbs-o-down': true,
            'invisible': votes[key] === 'upvote'
          });

          const upvoteClass = classNames({
            'fa fa-fw': true,
            'fa-thumbs-o-up': true,
            'invisible': votes[key] === 'downvote'
          });

          const downvotesClass = classNames({
            'col-lg-6': true,
            'os-matchup-vote-down': true,
            'os-matchup-item-votes-active': votes[key],
            'os-matchup-item-votes-non-active': !votes[key]
          });

          const upvotesClass = classNames({
            'col-lg-6': true,
            'os-matchup-vote-up': true,
            'os-matchup-item-votes-active': votes[key],
            'os-matchup-item-votes-non-active': !votes[key]
          });

          return (
            <div
              className="os-matchup-item media"
              key={key}
            >
              <Link
                className="media-left"
                to={`/matchups/${heroKey}/${matchupHeroKey}`}
              >
                <div className="os-matchup-thumb">
                  <img
                    width = "50"
                    height = "86"
                    className="os-matchup-thumb-img"
                    src={portrait}
                  />
                {/*"https://s3.amazonaws.com/solomid-resources/overwatch/heroes/ana/hero-select-portrait.png"*/}
                </div>
              </Link>
              <div className="media-body">
                <span className="os-matchup-item-name media-heading">{name}</span>
                <div className="os-matchup-vote-score">
                  <div
                    className={upvotesClass}
                    onClick={this.handleVote.bind(null, key, heroKey, matchupHeroKey, 'upvote')}
                  >
                    <i className={upvoteClass}></i>
                    &nbsp;
                    <span className={`jq-matchup-upvote-${key}`}>{upvotes}</span>
                  </div>
                  <div
                    className={downvotesClass}
                    onClick={this.handleVote.bind(null, key, heroKey, matchupHeroKey, 'downvote')}
                  >
                    <i className={downvoteClass}></i>
                    &nbsp;
                    <span className={`jq-matchup-downvote-${key}`}>{downvotes}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  handleVote = (key, heroKey, matchupHeroKey, downOrUp) => {
    const {
      dispatch
    } = this.props;

    const votes = JSON.parse(localStorage.getItem('matchupVotes'));

    if (!votes[key]) {
      dispatch(voteMatchup(heroKey, matchupHeroKey, downOrUp));

      const selector = `.jq-matchup-${downOrUp}-${key}`;
      const score = parseInt($(selector).text());
      $(selector).text(score + 1);

      const otherDownOrUp = downOrUp === 'downvote' ? 'upvote' : 'downvote';
      const otherSelector = `.jq-matchup-${otherDownOrUp}-${key}`;
      $(otherSelector).prev().addClass(`invisible`);

      $(selector).parent().addClass('os-matchup-item-votes-active');
      $(otherSelector).parent().addClass('os-matchup-item-votes-active');
      $(selector).parent().removeClass('os-matchup-item-votes-non-active');
      $(otherSelector).parent().removeClass('os-matchup-item-votes-non-active');

      votes[key] = downOrUp;
      localStorage.setItem('matchupVotes', JSON.stringify(votes));
    }
  };
}

function mapStateToProps (state) {
  const {
    riot: {
      heroes: {
        _map: heroesMap,
        isFetching: isFetchingHeroes
      }
    }
  } = state;

  return {
    heroesMap,
    isFetchingHeroes
  };
}
export default connect(mapStateToProps)(HeroMatchupsList);
