import React from 'react';
import changeCase from 'change-case';
import take from 'lodash/take';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import TipsList from './tipslist';
import Loader from '../../loader';
import { fetchSingleHero } from '../../../actions/api';

class StrategyTipsPage extends Component {
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

    this.state = {
      showCounterTipsForm: false
    };
  }

  componentDidMount () {
    // const {
    //   dispatch,
    //   token,
    //   username,
    //   userId
    // } = this.props;

    // if (!token && !username && !userId) {
    //   const localToken = localStorage.getItem('token');
    //   const localUsername = localStorage.getItem('username');
    //   const localUserId = localStorage.getItem('userId');

    //   if (localToken && localUsername && localUserId) {
    //     dispatch(setUser(localToken, localUsername, localUserId));
    //   }
    // }
  }

  componentWillMount () {
    const {
      dispatch,
      params: {
        heroKey: _heroKey
      }
    } = this.props;

    const heroKey = changeCase.lower(_heroKey);

    dispatch(fetchSingleHero(heroKey));
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
      dispatch(fetchSingleHero(nextHeroKey));
    }
  }

  render () {
    const {
      children,
      params: {
        heroKey: _heroKey
      },
      singleHero,
      isFetchingSingleHero
    } = this.props;

    if(isFetchingSingleHero || !singleHero){
      return (<Loader />);
    }

    // const {
    //   showCounterTipsForm
    // } = this.state;
    let  showCounterTipsForm = true;
    const heroKey = changeCase.lower(_heroKey);

    return (
      <div className="os-hero-tip-container">
        <div className="row">
          <div className="os-hero-viewall-tip-col">
            <div className="os-hero-tip-body">
              <span className="os-hero-tip-name">
                {changeCase.upper(singleHero.data.name)} 
              </span>
              <h5 className="os-hero-tip-title">STRATEGY & TIPS</h5>
              {!isFetchingSingleHero && singleHero ?
                <TipsList
                  tips={take(singleHero.data.tips, 5)}
                  shouldHideMeta={true}
                />
              : <Loader />}
            </div>
          </div>
          <div className="os-hero-addtip-tip-col">
            <div className="os-hero-addtip-body">
              <h5 className="os-hero-tip-title">ADD A TIP</h5>
              {/*token &&*/ showCounterTipsForm ?
                  <form>
                    <fieldset className="form-group">
                      <textarea
                        className="form-control os-textarea"
                        placeholder={`Share strategies and tips on how to play ${singleHero.data.name}`}
                        ref={c => this._counterTipsBox = c}
                        rows={9}
                      >
                      </textarea>
                    </fieldset>
                    
                    <button
                      className="btn btn-primary os-btn-blue"
                      type="submit"
                    >SUBMIT</button>
                  </form>
                : null}
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
      singleHero: {
        data: singleHeroData,
        isFetching: isFetchingSingleHero
      }
    }
  } = state;

  return {
    singleHero: singleHeroData,
    isFetchingSingleHero
  };
}

export default connect(mapStateToProps)(StrategyTipsPage);
