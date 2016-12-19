import React from 'react';
import changeCase from 'change-case';
import { take } from 'lodash';
import { Link } from 'react-router';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import TipsList from './tipslist';
import Loader from '../../loader';
import { fetchTipsIfNeeded } from '../../../actions/api';

class GeneralTipsPage extends Component {

  constructor (props) {
    super(props);
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

    dispatch(fetchTipsIfNeeded(heroKey));
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
      dispatch(fetchTipsIfNeeded(nextHeroKey));
    }
  }

  render () {
    const {
      children,
      params:{
        heroKey: _heroKey
      },
      tips,
      isFetchingTips
    } = this.props;

    if(isFetchingTips || !tips.for || !tips.against){
      return (<Loader />);
    }

    const heroKey = changeCase.lower(_heroKey);
    const heroName = tips.for.data.name;
    return (
      <div className="os-card-container os-hero-tip-container">
        <div className="row">
          <div className="os-card-col os-hero-tip-col">
            <div className="os-card-body os-hero-tip-body">
              <span className="os-hero-tip-name">
                {changeCase.upper(heroName)} 
              </span>
              <h5 className="os-hero-tip-title">STRATEGY & TIPS</h5>
              { 
                <TipsList
                  tips={take(tips.for.data.tips, 5)}
                  firstText={`Share a tip on how to play ${heroName}`}
                />
              }
              <div className="os-hero-tip-button-group">
                <Link
                  className="btn btn-primary os-btn-blue"
                  to={`/heroes/${heroKey}/for`}
                >
                ADD A TIP
                </Link>
                <button
                  className="btn btn-secondary os-btn-white"
                >VIEW ALL</button>
              </div>
            </div>
          </div>
          <div className="os-card-col os-hero-tip-col">
            <div className="os-card-body os-hero-tip-body">
              <span className="os-hero-tip-name">
                {changeCase.upper(heroName)} 
              </span>
              <h5 className="os-hero-tip-title">COUNTER TIPS</h5>
              { 
                <TipsList
                  tips={take(tips.against.data.tips, 5)}
                  firstText={`Share a tip on how to play against ${heroName}`}
                />
              }
              <div className="os-hero-tip-button-group">
                <Link
                  className="btn btn-primary os-btn-blue"
                  to={`/heroes/${heroKey}/against`}
                >
                ADD A TIP
                </Link>
                <button
                  className="btn btn-secondary os-btn-white"
                >VIEW ALL</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps (state) {
  const {
    api: {
      tips: {
        tips: tipsData,
        isFetching: isFetchingTips
      }
    }
  } = state;

  return {
    tips: tipsData,
    isFetchingTips
  };
}

export default connect(mapStateToProps)(GeneralTipsPage);
