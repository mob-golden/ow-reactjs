import React from 'react';
import changeCase from 'change-case';
import classNames from 'classnames';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import TipsList from '../tip/tipslist';
import Loader from '../../loader';
import { addHeroMatchupTip } from '../../../actions/all';
import { fetchMatchupTipsIfNeeded } from '../../../actions/api';
import { voteMatchup } from '../../../actions/all';

class MapRankingTipsPage extends Component {

  constructor (props) {
    super(props);
  }

  componentDidMount () {
    const {
      dispatch,
      token,
      username,
      userId
    } = this.props;

    if (!token && !username && !userId) {
      const localToken = localStorage.getItem('token');
      const localUsername = localStorage.getItem('username');
      const localUserId = localStorage.getItem('userId');

      if (localToken && localUsername && localUserId) {
        dispatch(setUser(localToken, localUsername, localUserId));
      }
    }
  }

  componentWillMount () {
    const {
      dispatch,
      params: {
        heroKey: _heroKey,
        mapKey: _mapKey
      }
    } = this.props;

    const heroKey = changeCase.lower(_heroKey);
    const mapKey = changeCase.lower(_mapKey);

    dispatch(fetchMatchupTipsIfNeeded(heroKey,mapKey));
  }

  componentWillReceiveProps (nextProps) {
    const {
      dispatch,
      params: {
        heroKey: _heroKey,
        mapKey: _mapKey
      }
    } = this.props;

    const {
      params: {
        heroKey: _nextHeroKey,
        mapKey: _nextMapKey
      }
    } = nextProps;

    const heroKey = changeCase.lower(_heroKey);
    const nextHeroKey = changeCase.lower(_nextHeroKey);
    const mapKey = changeCase.lower(_mapKey);
    const nextMapKey = changeCase.lower(_nextMapKey);

    if (heroKey !== nextHeroKey || mapKey !== nextMapKey) {
      dispatch(fetchMatchupTipsIfNeeded(nextHeroKey,nextMapKey));
    }
  }

  render () {
    const {
      
      heroesHash,
      isFetchingHeroes,
      mapsHash,
      isFetchingMaps,
      matchupTips,
      isFetchingMatchupTips,
      params: {
        heroKey: _heroKey,
        mapKey: _mapKey
      },
      token
    } = this.props;


    if(isFetchingMatchupTips || !matchupTips.for || isFetchingHeroes || !heroesHash || isFetchingMaps || !mapsHash){
      return (<Loader/>);
    }


    const showAddForm = true;
    const heroKey = changeCase.lower(_heroKey);
    const heroName = heroesHash[heroKey].name;
    const mapKey = changeCase.lower(_mapKey);
    const mapName = mapsHash[mapKey].name;
    const mapType = changeCase.upper(mapsHash[mapKey].type);
    const key = heroKey + mapKey;

    if (!localStorage.getItem('matchupVotes')) localStorage.setItem('matchupVotes', JSON.stringify({}));
    const votes =  JSON.parse(localStorage.getItem('matchupVotes'));

    const downvoteClass = classNames({
      'fa fa-fw': true,
      'fa-thumbs-o-down': true
    });

    const upvoteClass = classNames({
      'fa fa-fw': true,
      'fa-thumbs-o-up': true
    });

    const downvotesClass = classNames({
      'os-matchup-vote-down': true,
      'os-matchup-item-votes-active': votes[key],
      'os-matchup-item-votes-non-active': !votes[key]
    });

    const upvotesClass = classNames({
      'os-matchup-vote-up': true,
      'os-matchup-item-votes-active': votes[key],
      'os-matchup-item-votes-non-active': !votes[key]
    });


    return (
      <div className="os-hero-tip-container">
        <div className="row">
          <div className="os-map-header-nav">
            <div className="os-map-header-background">
              <img className="os-map-header-image" src={mapsHash[mapKey].image}/>
            </div>
            <div className="os-map-ranking-info">
              <span className="os-map-header-typename">
                { mapType } 
              </span>
              <h5 className="os-white os-font-size-24">
                { mapName }
              </h5>
            </div>
            <div className="os-map-ranking-vote-group">
              <span
                className={upvotesClass}
                onClick={this.handleVote.bind(null, key, heroKey, mapKey, 'upvote')}
              >
                <i className={upvoteClass}></i>
                &nbsp;
                <span className={`jq-matchup-upvote-${key}`}>{matchupTips.for.data.score.upvotes}</span>
              </span>
              <span
                className={downvotesClass}
                onClick={this.handleVote.bind(null, key, heroKey, mapKey, 'downvote')}
              >
                <i className={downvoteClass}></i>
                &nbsp;
                <span className={`jq-matchup-downvote-${key}`}>{matchupTips.for.data.score.downvotes}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="os-hero-viewall-tip-col">
            <div className="os-hero-tip-body">
              <span className="os-hero-tip-name">
                TIPS FOR {changeCase.upper(heroName)} 
              </span>
              <h5 className="os-hero-tip-title">
                { changeCase.upper(mapName) }
              </h5>
              <TipsList
                tips={matchupTips.for.data.tips}
              />
            </div>
          </div>
          {/*token && */ showAddForm ?
            <div className="os-hero-addtip-tip-col">
              <div className="os-hero-addtip-body">
                <h5 className="os-hero-tip-title">ADD A TIP</h5>
                <form 
                onSubmit={e => {
                  e.preventDefault()

                  const {
                    dispatch,
                    username,
                    userId
                  } = this.props;

                  const textarea = this._tipsBox;

                  if (textarea && textarea.value && token) {
                    const localUserId = localStorage.getItem('userId');
                    const localUsername = localStorage.getItem('username');

                    dispatch(addHeroMatchupTip({
                      authorId: localUserId,
                      authorName: localUsername,
                      heroKey: heroKey,
                      matchupKey: mapKey,
                      content: textarea.value,
                      tipType: "map",
                      token
                    }));
                  }
                }}>
                  <fieldset className="form-group">
                    <textarea
                      className="form-control os-textarea"
                      placeholder={ `Share strategies and tips on how to play ${heroName} on ${mapName}.` }
                      ref={c => this._tipsBox = c}
                      rows={9}
                    >
                    </textarea>
                  </fieldset>
                  
                  <button
                    className="btn btn-primary os-btn-blue"
                    type="submit"
                  >SUBMIT</button>
                </form>
              </div>
            </div>
          : null }
        </div>
      </div>
    );
  }

  handleVote = (key, heroKey, matchupHeroKey, downOrUp) => {
    const {
      dispatch
    } = this.props;

    const votes = JSON.parse(localStorage.getItem('matchupVotes'));

    if (!votes[key]) {
      dispatch(voteMatchup(heroKey, matchupHeroKey, downOrUp, 'map'));

      const selector = `.jq-matchup-${downOrUp}-${key}`;
      const score = parseInt($(selector).text());
      $(selector).text(score + 1);

      const otherDownOrUp = downOrUp === 'downvote' ? 'upvote' : 'downvote';
      const otherSelector = `.jq-matchup-${otherDownOrUp}-${key}`;
      
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
    auth: {
      token,
      username,
      userId,
    },
    map: {
      maps: {
        _hash: mapsHash,
        isFetching: isFetchingMaps
      }
    },
    hero: {
      heroes: {
        _hash: heroesHash,
        isFetching: isFetchingHeroes
      }
    },
    api: {
      matchupTips: {
        matchupTips: matchupTipsData,
        isFetching: isFetchingMatchupTips
      }
    }
  } = state;

  return {
    token,
    username,
    userId,
    heroesHash,
    isFetchingHeroes, 
    mapsHash,
    isFetchingMaps,
    matchupTips: matchupTipsData,
    isFetchingMatchupTips
  };
}

export default connect(mapStateToProps)(MapRankingTipsPage);