import React from 'react';
import moment from 'moment';
import changeCase from 'change-case';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Modal from '../../modal';
import Loader from '../../loader';
import { fetchThreadsIfNeeded } from '../../../actions/community';
import CommunityTypeAhead from '../../communitytypeahead';
import { FORUM_STRINGS } from '../../../constants/types';
import { addThread } from '../../../actions/all';

class ThreadsListPage extends Component {

  constructor (props) {
    super(props);
  }

  componentDidMount () {
  }

  componentWillMount () {    
    const {
      dispatch
    } = this.props;
    dispatch( fetchThreadsIfNeeded() );
  }

  render() {
    const {
      params: {
        commType
      }
    } = this.props;
    if(!FORUM_STRINGS[commType]) return(null);
    return (
      <div className="os-content container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="os-threads-header">
              <p className="os-white os-font-size-36 header-text">{changeCase.upper(FORUM_STRINGS[commType].title)}</p>
              <p className="os-white os-font-size-18 header-text">{FORUM_STRINGS[commType].text}</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="os-threads-list-conainer">
              <div className="os-threads-header-nav1">
                <div className="os-threads-search-nav">
                  <CommunityTypeAhead
                    inputGroupClass="input-group"
                    placeholder={"Search all forums"}
                  />
                </div>
                <div className="os-threads-new">
                  <button className="btn btn-primary os-btn-blue" data-toggle="modal" data-target="#modal-add-thread">
                    <i className="fa fa-plus"></i> NEW {changeCase.upper(FORUM_STRINGS[commType].itemText)}
                  </button>
                </div>
              </div>

              <div className="os-threads-header-nav2">
                <div className="os-page-path">
                  <span className="path1">Home • Community • </span> 
                  <span className="path2">{FORUM_STRINGS[commType].title}</span>
                </div>
                <div className="os-threads-sortby">
                  <span className="sort-item active">Most Recent</span>
                  <span className="sort-item">Popular</span>
                </div>
              </div>

              <div className="os-threads-list-body">
                { this.renderModal(commType) }
                { this.renderThreadsList(commType) }
              </div>

              <div className="os-threads-header-nav1">
                <div className="os-threads-search-nav">
                  <CommunityTypeAhead
                    inputGroupClass="input-group"
                    placeholder={"Search all forums"}
                  />
                </div>
                <div className="os-threads-new">
                  <button className="btn btn-primary os-btn-blue" data-toggle="modal" data-target="#modal-add-thread">
                    <i className="fa fa-plus"></i> NEW {changeCase.upper(FORUM_STRINGS[commType].itemText)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderThreadsList = (commType) =>{
    const {
      token,
      threads,
      isFetchingThreads
    } = this.props;

    if(isFetchingThreads || !threads.discussion){
      return (<Loader/>);
    }
    return(
      <div>
      {
        threads[commType].map(thread => {
          const {
            _id,
            createdAt,
            meta:{
              title,
              views
            }, 
            author:{
              id: authorId,
              name: authorName
            }
          } = thread;

          return (
            <div key={_id} className="os-thread">
              <img className="os-thread-avatar" width="40" height="40" src="//portal.exceda.net/img/avatar.png"/>

              <div className="os-thread-meta">
                <h5 className="os-thread-title">{title}</h5>

                <span className="os-thread-time">{moment(createdAt).fromNow()} by </span> 
                <span className="os-thread-author">{authorName} </span>
              </div>

              <div className="os-thread-stats">
                <span className="os-thread-views">
                  <i className="fa fa-eye"></i> 
                  {views}
                </span>
                <span className="os-thread-views">
                  <i className="fa fa-comment-o"></i> 
                  {123}
                </span>
              </div>
            </div>
          );
        })
      }
      </div>
    );
  };

  renderModal = (commType) => {
    const {
      dispatch
    } = this.props;

    const localToken = localStorage.getItem('token');
    const localUsername = localStorage.getItem('username');
    const localUserId = localStorage.getItem('userId');

    if(localToken){
      return (
        <div>
          <form onSubmit={e => {
              e.preventDefault();
              const input = this.input;
              const textarea = this.textarea;
              if (textarea && textarea.value && input && input.value) {
                dispatch(addThread({
                  type: commType,
                  topic: input.value,
                  content: textarea.value,
                  userId: localUserId,
                  userName: localUsername,
                  token: localToken
                }));
              }
              $(`#modal-add-thread`).modal('hide');
            }}>
            <Modal 
              id={`modal-add-thread`}
            >
              <fieldset className="os-modal-form-group-1">
                <h4 className="os-modal-title">{FORUM_STRINGS[commType].modalTitle}</h4>
                <span className="os-modal-description">{FORUM_STRINGS[commType].modalText}</span>
              </fieldset>
              <fieldset className="os-modal-form-group-2">
                <input
                  className="form-control os-modal-input"
                  id="topic"                  
                  placeholder="Topic"
                  required
                  type="text"
                  ref={c => this.input = c}
                />
              </fieldset>
              <fieldset className="os-modal-form-group-2">
                <textarea       
                  placeholder="Content"
                  className="form-control os-textarea"
                  ref={c => this.textarea = c}
                  rows={9}
                >
                </textarea>
              </fieldset>
              <fieldset className="os-modal-form-group-2">
                <button
                  className="btn btn-primary os-btn-blue"
                  type="submit"
                >CREATE TOPIC</button>
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
    community: {
      threads: {
        threads: threadsData,
        isFetching: isFetchingThreads
      }
    }
  } = state;

  return {
    token,
    threads: threadsData,
    isFetchingThreads
  };
}

export default connect(mapStateToProps)(ThreadsListPage);
