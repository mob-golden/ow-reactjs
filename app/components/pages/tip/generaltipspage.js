import React from 'react';
import changeCase from 'change-case';
import classNames from 'classnames';
import { take } from 'lodash';
import { Link } from 'react-router';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Modal from '../../modal';
import TipsList from './tipslist';
import Loader from '../../loader';
import { fetchTipsIfNeeded } from '../../../actions/api';
import { addHeroTip } from '../../../actions/all';

class GeneralTipsPage extends Component {

  constructor (props) {
    super(props);
    this.state = {
      leftViewAll: false,
      rightViewAll: false
    };
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

    const leftViewAllClassName = classNames({
      'btn btn-secondary os-btn-white':true,
      'hidden': tips.for.data.tips.length < 6
    });

    const rightViewAllClassName = classNames({
      'btn btn-secondary os-btn-white':true,
      'hidden': tips.against.data.tips.length < 6
    });
    return (
      <div className="os-hero-tip-container">
        <div className="row">
          <div className="os-hero-tip-col">
            { this.renderModal('for', heroKey, heroName) }
            <div className="os-hero-tip-body">
              <span className="os-hero-tip-name">
                {changeCase.upper(heroName)} 
              </span>
              <h5 className="os-hero-tip-title">STRATEGY & TIPS</h5>
              <TipsList
                tips={
                  this.state.leftViewAll?
                  tips.for.data.tips:
                  take(tips.for.data.tips, 5)
                }
                firstText={`Share a tip on how to play ${heroName}.`}
              />
              <div className="os-hero-tip-button-group">
                <button
                  className="btn btn-primary os-btn-blue"
                  data-toggle="modal"
                  data-target={`#modal-add-tip-for`}
                >
                  ADD A TIP
                </button>
                <button
                  className={leftViewAllClassName}
                  onClick={() => this.setState({leftViewAll: !this.state.leftViewAll })}
                >
                { this.state.leftViewAll?`VIEW LESS`:`VIEW ALL`}
                </button>
              </div>
            </div>
          </div>
          <div className="os-hero-tip-col">
            { this.renderModal('against', heroKey, heroName) }
            <div className="os-hero-tip-body">
              <span className="os-hero-tip-name">
                {changeCase.upper(heroName)} 
              </span>
              <h5 className="os-hero-tip-title">COUNTER TIPS</h5>
              <TipsList
                tips={
                  this.state.rightViewAll?
                  tips.against.data.tips:
                  take(tips.against.data.tips, 5)
                }
                firstText={`Share a tip on how to play against ${heroName}.`}
              />
              <div className="os-hero-tip-button-group">
                <button
                  className="btn btn-primary os-btn-blue"
                  data-toggle="modal"
                  data-target={`#modal-add-tip-against`}
                >
                  ADD A TIP
                </button>
                <button
                  className={rightViewAllClassName}
                  onClick={() => this.setState({rightViewAll: !this.state.rightViewAll })}
                >
                { this.state.rightViewAll?`VIEW LESS`:`VIEW ALL`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderModal = (type, heroKey, heroName) => {
    const {
      dispatch,
      token
    } = this.props;
    this._tipsBox = {
      type: {}
    };
    if(token){
      return (
        <div>
          <form onSubmit={e => {
              e.preventDefault();
              const textarea = this._tipsBox[type];
              if (textarea && textarea.value) {
                const localUserId = localStorage.getItem('userId');
                const localUsername = localStorage.getItem('username');

                dispatch(addHeroTip({
                  authorId: localUserId,
                  authorName: localUsername,
                  heroKey: heroKey,
                  content: textarea.value,
                  tipType: type,
                  token
                }));
                // dispatch(fetchTipsIfNeeded(heroKey));
              }
              $(`#modal-add-tip-${type}`).modal('hide');
              // location.reload();
            }}>
            <Modal 
              id={`modal-add-tip-${type}`}
            >
              <fieldset className="os-modal-form-group-1">
                <h4 className="os-modal-title">{`NEW TIP ${changeCase.upper(type)} ${changeCase.upper(heroName)}`}</h4>
                <span className="os-modal-description">{`Add a tip ${type} ${heroName}`}</span>
              </fieldset>
              <fieldset className="os-modal-form-group-2">
                <textarea
                  className="form-control os-textarea"
                  placeholder={type == "for" ? 
                                `Share strategies and tips on how to play ${heroName}.`:
                                `Share counter tips on how to play ${heroName}.`}
                  ref={c => this._tipsBox[type] = c}
                  rows={9}
                >
                </textarea>
              </fieldset>
              <fieldset className="os-modal-form-group-2">
                <button
                  className="btn btn-primary os-btn-blue"
                  type="submit"
                >SUBMIT</button>
              </fieldset>
            </Modal>
          </form>
        </div>
      );
    }
  };
}


function mapStateToProps (state) {
  const {
    auth: {
      token
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
    tips: tipsData,
    isFetchingTips
  };
}

export default connect(mapStateToProps)(GeneralTipsPage);
