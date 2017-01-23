import React from 'react';
import changeCase from 'change-case';
import classNames from 'classnames';
import moment from 'moment';

import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { voteMatchup } from '../../../actions/all';
import { MAPS_HASH } from '../../../constants/types';

class MapRankingsList extends Component {

  render () {
    const {
      heroKey,
      maps,
      matchups,
    } = this.props;

    // if (mapRankings.length === 0) {
    //   return (
    //     <div className="os-maprankings-list">
    //       <div className="col-lg-4">
    //         <div className="alert alert-warning">No Map Rankings!</div>
    //       </div>
    //     </div>
    //   );
    // }
    if (!localStorage.getItem('matchupVotes')) localStorage.setItem('matchupVotes', JSON.stringify({}));
    const votes =  JSON.parse(localStorage.getItem('matchupVotes'));

    return (
      <div className="os-maprankings-list">
      {
        matchups.map(matchup => {
          const {
            score:{
              score,
              upvotes,
              downvotes
            },
            opponent : mapKey,
          } = matchup;

          const {
            image,
            type: mapType,
            name
          } = maps[mapKey];

          const key = heroKey+mapKey;

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
            'os-matchup-vote-down': true,
            'os-matchup-item-votes-active': votedType,
            'os-matchup-item-votes-non-active': !votedType,
            'os-matchup-voted-down': votedType == 'downvote'
          });

          const upvotesClass = classNames({
            'os-matchup-vote-up': true,
            'os-matchup-item-votes-active': votedType,
            'os-matchup-item-votes-non-active': !votedType,
            'os-matchup-voted-up': votedType == 'upvote'
          });

          return (
            <div
              className="col-lg-4"
              key={mapKey}
            >
              <div className="os-map">
                <Link to={`/maprankingtips/${heroKey}/${mapKey}`} className="os-map-overlay">
                  VIEW TIPS
                </Link>
                <div className="os-map-profile">
                  <Link to={`/maprankingtips/${heroKey}/${mapKey}`}>
                    <span className="os-map-profile-type">{changeCase.upper(MAPS_HASH[mapType])}</span>
                    <h5 className="os-map-profile-title">{name}</h5>
                  </Link>
                  <div className="os-map-vote-group">
                    <span
                      className={upvotesClass}
                      onClick={this.handleVote.bind(null, key, heroKey, mapKey, 'upvote')}
                    >
                      <i className={upvoteClass}></i>
                      &nbsp;
                      <span className={`jq-matchup-upvote-${key}`}>{upvotes}</span>
                    </span>
                    <span
                      className={downvotesClass}
                      onClick={this.handleVote.bind(null, key, heroKey, mapKey, 'downvote')}
                    >
                      <i className={downvoteClass}></i>
                      &nbsp;
                      <span className={`jq-matchup-downvote-${key}`}>{downvotes}</span>
                    </span>
                  </div>
                </div>
                <img
                  width="100%"
                  height="212"
                  className="os-map-image"
                  src={image}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  handleVote = (key, heroKey, mapKey, downOrUp) => {
    const {
      dispatch
    } = this.props;

    const votes = JSON.parse(localStorage.getItem('matchupVotes'));

    if (!votes[key]) {
      dispatch(voteMatchup(heroKey, mapKey, downOrUp, 'map'));

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

export default connect()(MapRankingsList);
