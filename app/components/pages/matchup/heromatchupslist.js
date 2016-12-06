import React from 'react';
import changeCase from 'change-case';
import classNames from 'classnames';
import { take, toArray } from 'lodash';

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
      herosMap,
      matchups,
      shouldHideMeta
    } = this.props;

    const counterMatchups = take(matchups.data,6);

    if (!localStorage.getItem('matchupVotes')) localStorage.setItem('matchupVotes', JSON.stringify({}));
    const votes =  JSON.parse(localStorage.getItem('matchupVotes'));
    
    return (
      <div className="os-matchups-list">
      {
        counterMatchups.map(matchup => {
          const {
            champKey: heroKey,
            downvotes,
            upvotes,
            score,
            lane,
            type,
            matchupChampKey: matchupHeroKey,
          } = matchup;

          const {
            image: {
              full
            },
            name
          } = herosMap[matchupHeroKey];

          const key = matchupHeroKey + lane + type;

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
                    src="https://s3.amazonaws.com/solomid-resources/overwatch/heroes/ana/hero-select-portrait.png"
                  />
                {/*`${RIOT_HERO_ICONS_URL}/${full}`*/}
                </div>
              </Link>
              <div className="media-body">
                <span className="os-matchup-item-name media-heading">{name}</span>
                <div className="os-matchup-vote-score">
                  <div
                    className={upvotesClass}
                    onClick={this.handleVote.bind(null, key, heroKey, matchupHeroKey, lane, type, 'upvote')}
                  >
                    <i className={upvoteClass}></i>
                    &nbsp;
                    <span className={`jq-matchup-upvote-${key}`}>{upvotes}</span>
                  </div>
                  <div
                    className={downvotesClass}
                    onClick={this.handleVote.bind(null, key, heroKey, matchupHeroKey, lane, type, 'downvote')}
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

  handleVote = (key, heroKey, matchupHeroKey, lane, type, downOrUp) => {
    const {
      dispatch
    } = this.props;

    const votes = JSON.parse(localStorage.getItem('matchupVotes'));

    if (!votes[key]) {
      dispatch(voteMatchup(heroKey, matchupHeroKey, lane, type, downOrUp));

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

export default connect()(HeroMatchupsList);
