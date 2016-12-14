import React from 'react';
import changeCase from 'change-case';
import take from 'lodash/take';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import TipsList from '../tip/tipslist';
import Loader from '../../loader';
import { fetchMatchupTipsForVS } from '../../../actions/api';

class MatchupTipsPage extends Component {
  // static propTypes = {
  //   dispatch: PropTypes.func.isRequired,
  //   heroes: PropTypes.object.isRequired,
  //   counterTips: PropTypes.array.isRequired,
  //   matchups: PropTypes.array.isRequired,
  //   isFetchingHeroes: PropTypes.bool.isRequired,
  //   isFetchingCounterTips: PropTypes.bool.isRequired,
  //   isFetchingMatchups: PropTypes.bool.isRequired
  // };

  constructor (props) {
    super(props);
  }

  componentDidMount () {
  }

  componentWillMount () {
    const {
      dispatch,
      params: {
        heroKey: _heroKey,
        matchupHeroKey: _matchupHeroKey
      }
    } = this.props;

    const heroKey = changeCase.lower(_heroKey);
    const matchupHeroKey = changeCase.lower(_matchupHeroKey);


    dispatch(fetchMatchupTipsForVS(heroKey,matchupHeroKey));
  }

  componentWillReceiveProps (nextProps) {
    const {
      dispatch,
      params: {
        heroKey: _heroKey,
        matchupHeroKey: _matchupHeroKey
      }
    } = this.props;

    const {
      params: {
        heroKey: _nextHeroKey,
        matchupHeroKey: _nextMatchupHeroKey
      }
    } = nextProps;

    const heroKey = changeCase.lower(_heroKey);
    const matchupHeroKey = changeCase.lower(_matchupHeroKey);

    const nextHeroKey = changeCase.lower(_nextHeroKey);
    const nextMatchupHeroKey = changeCase.lower(_nextMatchupHeroKey);

    if (heroKey !== nextHeroKey || matchupHeroKey !== nextMatchupHeroKey) {
      dispatch(fetchMatchupTipsForVS(nextHeroKey,nextMatchupHeroKey));
    }
  }

  render () {
    const {
      heroes,
      matchupTips,
      isFetchingMatchupTips,
      params: {
        heroKey: _heroKey,
        matchupHeroKey: _matchupHeroKey
      },
      token
    } = this.props;

    // const {
    //   showCounterTipsForm
    // } = this.state;

    const heroKey = changeCase.lower(_heroKey);
    const matchupHeroKey = changeCase.lower(_matchupHeroKey);

    if(isFetchingMatchupTips || !matchupTips.for){
      return (<Loader/>);
    }

    return (
      <div className="os-matchup-tip-container">
        <div className="row">
          <div className="os-matchup-tip-col">
            <div className="os-matchup-tip-body">
              <span className="os-matchup-tip-name">
                TIPS VS. {/*changeCase.upper(heroes.data[matchupHeroKey].name)*/} 
              </span>
              <h5 className="os-matchup-left-title">AS <span>{changeCase.upper(heroes.data[heroKey].name)}</span></h5>

              <TipsList
                tips={take(matchupTips.for.data, 5)}
                shouldHideMeta={true}
              />
              <div className="row">
                <div className="col-lg-3">
                  <a href="#" className="btn btn-primary os-btn-blue">ADD A TIP</a>
                </div>
                <div className="col-lg-3"> 
                  <a href="#" className="btn btn-secondary os-btn-white">VIEW ALL</a>
                </div>
              </div>
            </div>
          </div>
          <div className="os-hero-tip-col">
            <div className="os-hero-tip-body">
              {/* TODO HERE */}
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
      matchupTips: {
        matchupTips: matchupTipsData,
        isFetching: isFetchingTips
      }
    }
  } = state;

  return {
    matchupTips: matchupTipsData,
    isFetchingTips
  };
}

export default connect(mapStateToProps)(MatchupTipsPage);
