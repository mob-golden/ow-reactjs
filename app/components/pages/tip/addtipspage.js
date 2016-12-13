import React from 'react';
import changeCase from 'change-case';
import take from 'lodash/take';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import TipsList from './tipslist';
import Loader from '../../loader';
import { fetchTipsForHero } from '../../../actions/api';
import { addHeroTip } from '../../../actions/all';

class AddTipsPage extends Component {

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
        heroKey: _heroKey
      }
    } = this.props;

    const heroKey = changeCase.lower(_heroKey);

    dispatch(fetchTipsForHero(heroKey));
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
      dispatch(fetchTipsForHero(nextHeroKey));
    }
  }

  render () {
    const {
      children,
      params: {
        heroKey: _heroKey,
        tipType: _tipType
      },
      tips,
      isFetchingTips,
      token
    } = this.props;

    if(isFetchingTips || !tips.for || !tips.against){
      return (<Loader />);
    }

    const showAddForm = true;
    const tipType = _tipType;
    const heroKey = changeCase.lower(_heroKey);
    const heroName = changeCase.upper(tips.for.data.name);

    return (
      <div className="os-hero-tip-container">
        <div className="row">
          <div className="os-hero-viewall-tip-col">
            <div className="os-hero-tip-body">
              <span className="os-hero-tip-name">
                {heroName} 
              </span>
              <h5 className="os-hero-tip-title">
                { tipType == "for" ? `ALL STRATEGY & TIPS` : `ALL COUNTER TIPS` }
              </h5>
              <TipsList
                tips={tipType == "for" ? tips.for.data.tips : tips.against.data.tips}
                shouldHideMeta={true}
              />
            </div>
          </div>
          {/*token &&*/ showAddForm ?
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

                    dispatch(addHeroTip({
                      authorId: localUserId,
                      authorName: localUsername,
                      heroKey: heroKey,
                      content: textarea.value,
                      tipType: tipType,
                      token
                    }));

                    //location.reload();
                  }
                }}>
                  <fieldset className="form-group">
                    <textarea
                      className="form-control os-textarea"
                      placeholder={tipType == "for" ? 
                                    `Share strategies and tips on how to play ${heroName}.`:
                                    `Share counter tips on how to play ${heroName}.`}
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
          : null}
        </div>
      </div>
    );
  }
}


function mapStateToProps (state) {
  const {
    auth: {
      token,
      username,
      userId,
    },
    api: {
      tips: {
        tips: tipsData,
        isFetching: isFetchingTips
      }
    }
  } = state;

  return {
    token,
    username,
    userId,
    tips: tipsData,
    isFetchingTips
  };
}

export default connect(mapStateToProps)(AddTipsPage);
