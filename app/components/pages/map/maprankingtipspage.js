import React from 'react';
import changeCase from 'change-case';
import classNames from 'classnames';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { take } from 'lodash';
import moment from 'moment';


import TipList from '../tip/tiplist';
import Loader from '../../loader';
import PageNotFound from '../notfound/PageNotFound';
import { addHeroMatchupTip } from '../../../actions/all';
import { fetchMatchupTipsIfNeeded } from '../../../actions/api';
import { voteMatchup } from '../../../actions/all';
import { MAPS_HASH } from '../../../constants/types';

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

    dispatch(fetchMatchupTipsIfNeeded(heroKey,mapKey, 'map'));
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
      dispatch(fetchMatchupTipsIfNeeded(nextHeroKey,nextMapKey,'map'));
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

    if(!mapsHash[mapKey]){
      window.location.href="/404";
      return;
    }

    const mapName = mapsHash[mapKey].name;
    const mapType = changeCase.upper(mapsHash[mapKey].type);
    const key = heroKey + mapKey;
    const tipLength = matchupTips.for.data.tips.length;

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

    let votedType = votes[key];
    if(votedType){
      votedType = votedType.split(' ')[0];
    }
    const downvotesClass = classNames({
      'os-map-vote-down': true,
      'os-matchup-item-votes-active': votedType,
      'os-matchup-item-votes-non-active': !votedType,
      'os-matchup-voted-down': votedType == 'downvote'
    });

    const upvotesClass = classNames({
      'os-map-vote-up': true,
      'os-matchup-item-votes-active': votedType,
      'os-matchup-item-votes-non-active': !votedType,
      'os-matchup-voted-up': votedType == 'upvote'
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
                { MAPS_HASH[mapType] }
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
            <div className="os-card-body os-hero-tip-body">
              <span className="os-hero-tip-name">
                TIPS FOR {changeCase.upper(heroName)}
              </span>
              <h5 className="os-hero-tip-title">
                { changeCase.upper(mapName) }
              </h5>
              <TipList
                masterKey={heroKey}
                listId="maprankingtip"
                tips={take(matchupTips.for.data.tips, tipLength)}
                firstText={`Share a tip on how to play ${heroName} on ${mapName}.`}
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

                    dispatch(addHeroMatchupTip({
                      heroKey: heroKey,
                      matchupKey: mapKey,
                      content: textarea.value,
                      tipType: "map",
                      token
                    }));

                    const tmp_data = {
                      _id:'9999999999'+textarea.value,
                      authorName: localStorage.getItem('username'),
                      contentRaw: textarea.value,
                      created_at: "2000-01-01T00:00:00.938Z",
                      score: {
                        upvotes: 1,
                        downvotes: 0,
                        hotScore: 1,
                        total: 1,
                      },
                      type: "map"
                    };
                    this.props.matchupTips.for.data.tips.push(tmp_data);
                    this.forceUpdate();
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

      const votedItemClass = downOrUp === 'upvote'? 'up' : 'down';
      $(selector).parent().addClass(`os-matchup-voted-${votedItemClass}`);

      votes[key] = downOrUp + ' '+ moment().valueOf();
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
