import React from 'react';
import changeCase from 'change-case';
import classNames from 'classnames';
import Modal from '../../modal';
import { take } from 'lodash';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import MatchupList from './matchuplist';
import Loader from '../../loader';
import Typeahead from '../../typeahead';

import { addHeroMatchup } from '../../../actions/all';
import { fetchMatchupsIfNeeded } from '../../../actions/api';

class HeroMatchupsPage extends Component {

  constructor (props) {
    super(props);
    this.state = {
      positiveViewAll: false,
      negativeViewAll: false,
      teamupViewAll: false
    };
  }

  handlePositiveViewAll(){
    this.setState({positiveViewAll: !this.state.positiveViewAll });
  }

  handleNegativeViewAll(){
    this.setState({negativeViewAll: !this.state.negativeViewAll });
  }

  handleTeamupViewAll(){
    this.setState({teamupViewAll: !this.state.teamupViewAll });
  }

  componentDidMount () {

  }

  componentWillMount () {
    const {
      dispatch,
      params: {
        heroKey: _heroKey
      }
    } = this.props;

    const heroKey = changeCase.lower(_heroKey);

    dispatch(fetchMatchupsIfNeeded(heroKey));
  }

  componentWillReceiveProps (nextProps) {
    const {
      dispatch,
      params: {
        heroKey: _heroKey
      }
    } = this.props;

    const {
      params: {
        heroKey: _nextHeroKey
      }
    } = nextProps;

    const heroKey = changeCase.lower(_heroKey);
    const nextHeroKey = changeCase.lower(_nextHeroKey);

    if (heroKey !== nextHeroKey) {
      dispatch(fetchMatchupsIfNeeded(nextHeroKey));
    }
  }

  render () {

    const {
      children,
      matchups,
      isFetchingMatchups,
      params: {
        heroKey: _heroKey
      },
      token
    } = this.props;

    if(isFetchingMatchups || !matchups.positive || !matchups.negative || !matchups.teamup){
      return (<Loader/>);
    }
    const heroKey = changeCase.lower(_heroKey);
    const heroName = matchups.positive.data.name;

    const positiveViewAllClassName = classNames({
      'btn btn-secondary os-btn-white':true,
      'hidden': matchups.positive.data.matchups.length < 7
    });

    const negativeViewAllClassName = classNames({
      'btn btn-secondary os-btn-white':true,
      'hidden': matchups.negative.data.matchups.length < 7
    });

    const teamupViewAllClassName = classNames({
      'btn btn-secondary os-btn-white':true,
      'hidden': matchups.teamup.data.matchups.length < 7
    });

    return (
      <div className="os-card-container os-hero-matchups-container">
        <div className="row">
          <div className="os-card-col os-hero-matchups-col os-card-separated-subcards">
          { this.renderModal('positive', heroKey, heroName) }
            <div className="os-card-body os-hero-matchups-body">
              <span className="os-matchups-hero-name">
                {changeCase.upper(heroName)}
              </span>
              <h5 className="os-matchups-title">COUNTERS</h5>

                <MatchupList
                  heroKey={heroKey}
                  matchups={
                    this.state.positiveViewAll?
                    matchups.positive.data.matchups:
                    take(matchups.positive.data.matchups, 6)
                  }
                  matchupType = "positive"
                  firstText = {`Add a Hero that ${heroName} counters.`}
                />
              <div className="row center-text">
                <button
                  className="btn btn-primary os-btn-blue"
                  onClick={this.handleAddMatchup.bind(null,'positive')}
                >
                  ADD A MATCHUP
                </button>
                <button
                  className={positiveViewAllClassName}
                  onClick={() => this.handlePositiveViewAll()}
                >
                  { this.state.positiveViewAll?`VIEW LESS`:`VIEW MORE`}
                </button>
              </div>
            </div>
          </div>
          <div className="os-card-col os-hero-matchups-col os-card-separated-subcards">
            { this.renderModal('negative', heroKey, heroName) }
            <div className="os-card-body os-hero-matchups-body">
              <span className="os-matchups-hero-name">
                {changeCase.upper(heroName)} IS
              </span>
              <h5 className="os-matchups-title">COUNTERED BY</h5>

                <MatchupList
                  heroKey={heroKey}
                  matchups={
                    this.state.negativeViewAll?
                    matchups.negative.data.matchups:
                    take(matchups.negative.data.matchups, 6)
                  }
                  matchupType = "negative"
                  firstText = {`Add a Hero that counters ${heroName}.`}
                />
              <div className="row center-text">
                <button
                  className="btn btn-primary os-btn-blue"
                  onClick={this.handleAddMatchup.bind(null,'negative')}
                >
                  ADD A MATCHUP
                </button>
                <button
                  className={negativeViewAllClassName}
                  onClick={() => this.handleNegativeViewAll()}
                >
                  { this.state.negativeViewAll?`VIEW LESS`:`VIEW MORE`}
                </button>
              </div>
            </div>
          </div>
          <div className="os-card-col os-hero-matchups-col os-card-separated-subcards">
            { this.renderModal('teamup', heroKey, heroName) }
            <div className="os-card-body os-hero-matchups-body">
              <span className="os-matchups-hero-name">
                {changeCase.upper(heroName)}
              </span>
              <h5 className="os-matchups-title">SYNERGIZES WITH</h5>

                <MatchupList
                  heroKey={heroKey}
                  matchups={
                    this.state.teamupViewAll?
                    matchups.teamup.data.matchups:
                    take(matchups.teamup.data.matchups, 6)
                  }
                  matchupType = "teamup"
                  firstText = {`Add a Hero that ${heroName} can team well with.`}
                />
              <div className="row center-text">
                <button
                  className="btn btn-primary os-btn-blue"
                  onClick={this.handleAddMatchup.bind(null,'teamup')}
                >
                  ADD A MATCHUP
                </button>
                <button
                  className={teamupViewAllClassName}
                  onClick={() => this.handleTeamupViewAll()}
                >
                  { this.state.teamupViewAll?`VIEW LESS`:`VIEW MORE`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  handleAddMatchup = (type)=>{
    const localToken = localStorage.getItem('token');
    if(!localToken){
      $('#sign-in').modal('show');
    }
    else{
      $(`#modal-add-matchup-${type}`).modal('show');
    }
  }

  renderModal = (type, heroKey, heroName) => {
    const {
      dispatch,
      token
    } = this.props;
    if(token){
      const title = `NEW MATCHUP FOR ${changeCase.upper(heroName)}`;
      let description = '';
      if(type == "positive")
        description = `Choose a Hero that ${heroName} counters.`;
      if(type == "negative")
        description = `Choose a Hero that counters ${heroName}.`;
      if(type == "teamup")
        description = `Choose a Hero that ${heroName} can team well with.`;
      return (
        <div>
          <form>
            <Modal
              id={`modal-add-matchup-${type}`}
            >
              <fieldset className="os-modal-form-group-1">
                <h4 className="os-modal-title">{title}</h4>
                <span className="os-modal-description">{description}</span>
              </fieldset>
              <fieldset className="os-modal-form-group-2">
                <Typeahead
                  constructLink={(id) => `javascript:void(0)`}
                  handleHeroClick={(id) => this.addMatchupHero(id, type)}
                  inputGroupClass="input-group"
                  placeholder={"Search for a Hero"}
                />
              </fieldset>
              <fieldset className="os-modal-form-group-2">
                <div>
                  { this.renderHeroesList(type, heroKey) }
                </div>
              </fieldset>
            </Modal>
          </form>
        </div>
      );
    }
  };

  renderHeroesList = (type, heroKey) => {
    const {
      isFetchingHeroes,
      heroesArray
    } = this.props;

    if(isFetchingHeroes || !heroesArray) return;

    return (
      <div>
        {
          heroesArray.map(hero => {
            const {
              id,
              icon: image
            } = hero;

            return (
              <Link
                onClick={e => {this.addMatchupHero(id, type); return false;}}
                key={id}
              >
                <div
                  className="os-hero-footer-thumb"
                >
                  <img
                    width="75"
                    height="75"
                    className="os-hero-footer-thumb-img"
                    src={image}
                  />
                </div>
              </Link>
            );
          })
        }
      </div>
    );
  }

  addMatchupHero = (id, type) => {
    $(`#modal-add-matchup-${type}`).modal('hide');
    const {
      params:{
        heroKey: _heroKey
      },
      dispatch,
      token
    } = this.props;
    const heroKey = changeCase.lower(_heroKey);

    if(token){
      dispatch(addHeroMatchup({
        heroKey: heroKey,
        matchupKey: id,
        type,
        token
      }));
      
      const tmp_data = {
        opponent: id,
        score:{
          upvotes: 1,
          downvotes: 0,
          total: 1,
        },
        type
      };
      this.props.matchups[type].data.matchups.push(tmp_data);
      this.forceUpdate();
    }
  }
}


function mapStateToProps (state) {
  const {
    auth:{
      token
    },
    api: {
      matchups: {
        matchups: matchupsData,
        isFetching: isFetchingMatchups
      }
    },
    hero: {
      heroes: {
        _array: heroesArray,
        isFetching: isFetchingHeroes
      }
    }
  } = state;

  return {
    token,
    matchups: matchupsData,
    isFetchingMatchups,
    heroesArray,
    isFetchingHeroes
  };
}

export default connect(mapStateToProps)(HeroMatchupsPage);
