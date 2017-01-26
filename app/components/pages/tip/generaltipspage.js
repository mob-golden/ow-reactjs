import React from 'react';
import changeCase from 'change-case';
import classNames from 'classnames';
import { take } from 'lodash';
import { Link } from 'react-router';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Modal from '../../modal';
import TipList from './tiplist';
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
      <div className="os-card-container os-hero-tip-container">
        <div className="row">
          <div className="os-card-col os-hero-tip-col">
            { this.renderModal('for', heroKey, heroName) }
            <div className="os-card-body os-hero-tip-body">
              <span className="os-hero-tip-name">
                {changeCase.upper(heroName)} 
              </span>
              <h5 className="os-hero-tip-title">STRATEGY & TIPS</h5>
              <TipList
                masterKey={heroKey}
                listId="for"
                tips={
                  this.state.leftViewAll?
                  tips.for.data.tips:
                  take(tips.for.data.tips, 5)
                }
                firstText={`Share a tip on how to play ${heroName}.`}
              />
              <div className="os-tip-button-group">
                <button
                  className="btn btn-primary os-btn-blue"
                  onClick={this.handleAddTip.bind(null,'for')}
                >
                  ADD A TIP
                </button>
                <button
                  className={leftViewAllClassName}
                  onClick={() => this.setState({leftViewAll: !this.state.leftViewAll })}
                >
                { this.state.leftViewAll?`VIEW LESS`:`VIEW MORE`}
                </button>
              </div>
            </div>
          </div>
          <div className="os-card-col os-hero-tip-col">
            { this.renderModal('against', heroKey, heroName) }
            <div className="os-card-body os-hero-tip-body">
              <span className="os-hero-tip-name">
                {changeCase.upper(heroName)} 
              </span>
              <h5 className="os-hero-tip-title">COUNTER TIPS</h5>
              <TipList
                masterKey={heroKey}
                listId = "against"
                tips={
                  this.state.rightViewAll?
                  tips.against.data.tips:
                  take(tips.against.data.tips, 5)
                }
                firstText={`Share a tip on how to play against ${heroName}.`}
              />
              <div className="os-tip-button-group">
                <button
                  className="btn btn-primary os-btn-blue"
                  onClick={this.handleAddTip.bind(null,'against')}
                >
                  ADD A TIP
                </button>
                <button
                  className={rightViewAllClassName}
                  onClick={() => this.setState({rightViewAll: !this.state.rightViewAll })}
                >
                { this.state.rightViewAll?`VIEW LESS`:`VIEW MORE`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  handleAddTip = (type)=>{
    const localToken = localStorage.getItem('token');
    if(!localToken){
      $('#sign-in').modal('show');
    }
    else{
      $(`#modal-add-tip-${type}`).modal('show');
    }
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
                dispatch(addHeroTip({
                  heroKey: heroKey,
                  content: textarea.value,
                  tipType: type,
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
                  type: type
                };
                this.props.tips[type].data.tips.push(tmp_data);
                this.forceUpdate();
              }

              $(`#modal-add-tip-${type}`).modal('hide');
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
