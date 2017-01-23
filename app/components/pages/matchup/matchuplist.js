import React from 'react';
import changeCase from 'change-case';
import classNames from 'classnames';
import FontAwesome from 'react-fontawesome';
import moment from 'moment';

import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { voteMatchup } from '../../../actions/all';

class MatchupList extends Component {

  render () {
    const {
      heroKey,
      heroesHash,
      matchups,
      matchupType,
      firstText,
      customType
    } = this.props;

    if (matchups.length === 0) {
      return (
        <div className="os-matchups-list">
          <div className="os-alert-warning">
            {firstText}
          </div>
        </div>
      );
    }

    if (!localStorage.getItem('matchupVotes')) localStorage.setItem('matchupVotes', JSON.stringify({}));
    const votes =  JSON.parse(localStorage.getItem('matchupVotes'));

    return (
      <div className="os-matchups-list">
      {
        matchups.map(matchup => {

          const {
            score:{
              total: score,
              downvotes,
              upvotes
            },
            type
          } = matchup;

          const matchupHeroKey = customType == "mapMatchup" ? matchup.heroId : matchup.opponent;
          
          const {
            portrait,
            name
          } = heroesHash[matchupHeroKey];

          const key = heroKey + matchupHeroKey + type;

          const downvoteClass = classNames({
            'fa fa-fw': true,
            'fa-thumbs-o-down': true
          });

          const upvoteClass = classNames({
            'fa fa-fw': true,
            'fa-thumbs-o-up': true
          });

          let votedType = votes[key];
          if(votedType){
            votedType = votedType.split(' ')[0];
          }
          const downvotesClass = classNames({
            'col-xs-6': true,
            'os-matchup-vote-down': true,
            'os-matchup-item-votes-active': votedType,
            'os-matchup-item-votes-non-active': !votedType,
            'os-matchup-voted-down': votedType == 'downvote'
          });

          const upvotesClass = classNames({
            'col-xs-6': true,
            'os-matchup-vote-up': true,
            'os-matchup-item-votes-active': votedType,
            'os-matchup-item-votes-non-active': !votedType,
            'os-matchup-voted-up': votedType == 'upvote'
          });

          const matchupLink = customType == 'mapMatchup' ? 
                                                    `/hero/${matchupHeroKey}/maprankings` : 
                                                    `/matchuptips/${heroKey}/${matchupHeroKey}/${matchupType}`;
          return (
            <div
              className="os-matchup-item media"
              key={key}
            >
              <Link
                className="media-left"
                to={matchupLink}
              >
                <div className="os-matchup-thumb">
                  <img
                    width = "50"
                    height = "86"
                    className="os-matchup-thumb-img"
                    src={portrait}
                  />
                  <div
                    className="os-matchup-thumb-img-overlay"
                  >
                    <FontAwesome name="chevron-right" />
                  </div>
                </div>
              </Link>
              <div className="media-body">
                <span className="os-matchup-item-name media-heading">{name}</span>
                <div className="os-matchup-vote-score">
                  <div
                    className={upvotesClass}
                    onClick={this.handleVote.bind(null, key, heroKey, matchupHeroKey, 'upvote', matchupType)}
                  >
                    <i className={upvoteClass}></i>
                    &nbsp;
                    <span className={`jq-matchup-upvote-${key}`}>{upvotes}</span>
                  </div>
                  <div
                    className={downvotesClass}
                    onClick={this.handleVote.bind(null, key, heroKey, matchupHeroKey, 'downvote', matchupType)}
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

  handleVote = (key, heroKey, matchupHeroKey, downOrUp, matchupType) => {
    const {
      dispatch
    } = this.props;

    const votes = JSON.parse(localStorage.getItem('matchupVotes'));

    if (!votes[key]) {
      dispatch(voteMatchup(heroKey, matchupHeroKey, downOrUp, matchupType));

      const selector = `.jq-matchup-${downOrUp}-${key}`;
      const score = parseInt($(selector).text());
      $(selector).text(score + 1);

      const otherDownOrUp = downOrUp === 'downvote' ? 'upvote' : 'downvote';
      const otherSelector = `.jq-matchup-${otherDownOrUp}-${key}`;

      $(selector).parent().addClass('os-matchup-item-votes-active');
      $(otherSelector).parent().addClass('os-matchup-item-votes-active');
      $(selector).parent().removeClass('os-matchup-item-votes-non-active');
      $(otherSelector).parent().removeClass('os-matchup-item-votes-non-active');

      const votedItemClass = downOrUp === 'upvote'? 'up' : 'down';
      $(selector).parent().addClass(`os-matchup-voted-${votedItemClass}`);

      votes[key] = downOrUp + ' '+ moment().valueOf();
      
      localStorage.setItem('matchupVotes', JSON.stringify(votes));
    }
  };
}

function mapStateToProps (state) {
  const {
    hero: {
      heroes: {
        _hash: heroesHash,
        isFetching: isFetchingHeroes
      }
    }
  } = state;

  return {
    heroesHash,
    isFetchingHeroes
  };
}
export default connect(mapStateToProps)(MatchupList);
