import React from 'react';
import moment from 'moment';
import changeCase from 'change-case';
import classNames from 'classnames';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Modal from '../../modal';
import Loader from '../../loader';
import PageNotFound from '../notfound/PageNotFound';
import CommunityTypeAhead from '../../communitytypeahead';
import EditDeleteButton from '../../editdeletebutton';
import { FORUM_STRINGS } from '../../../constants/types';
import { addComment, voteComment, deleteCommunityComment, editCommunityComment } from '../../../actions/all';
import { fetchSingleThreadIfNeeded } from '../../../actions/community';

class SingleThreadPage extends Component {

  constructor (props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.renderEditModal = this.renderEditModal.bind(this);
    this.commentDivs = [];
  }

  componentDidMount () {
  }

  componentWillMount () {
    const {
      dispatch,
      params: {
        threadId
      }
    } = this.props;
    dispatch( fetchSingleThreadIfNeeded(threadId));
  }

  componentWillReceiveProps (nextProps){
    const {
      dispatch,
      params: {
        threadId: threadId
      }
    } = this.props;

    const {
      params: {
        threadId: nextThreadId
      }
    } = nextProps;

    if (threadId !== nextThreadId) {
      dispatch( fetchSingleThreadIfNeeded(nextThreadId));
    }
  }

  render() {
    const {
      params: {
        commType,
        threadId
      },
      singleThread,
      isFetchingSingleThread
    } = this.props;

    if(isFetchingSingleThread || !singleThread)
      return(<Loader/>);

    if(!FORUM_STRINGS[commType]) {
      return (<PageNotFound/>);
    }
    
    if (!localStorage.getItem('commentVotes')) localStorage.setItem('commentVotes', JSON.stringify({}));
    const votes =  JSON.parse(localStorage.getItem('commentVotes'));
    const key = singleThread._id;
    const downvoteClass = classNames({
      'fa fa-fw': true,
      'fa-thumbs-o-down': true
    });

    const upvoteClass = classNames({
      'fa fa-fw': true,
      'fa-thumbs-o-up': true
    });

    const downvotesClass = classNames({
      'os-comment-vote-down': true,
      'os-comment-item-votes-active': votes[key],
      'os-comment-item-votes-non-active': !votes[key],
      'os-comment-voted-down': votes[key] == 'downvote'
    });

    const upvotesClass = classNames({
      'os-comment-vote-up': true,
      'os-comment-item-votes-active': votes[key],
      'os-comment-item-votes-non-active': !votes[key],
      'os-comment-voted-up': votes[key] == 'upvote'
    });

    return (
      <div className="os-content container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="os-content-body os-singlethread-list-container">
              <div className="os-singlethread-header">
                <div className="os-page-path">
                  <span className="path1">
                    <Link to="/heroes">Home</Link> • <Link to="/community">Community</Link> • <Link to={`/community/${FORUM_STRINGS[commType].link}`}>{FORUM_STRINGS[commType].title}</Link> •
                  </span>
                  <span className="path2"> {singleThread.meta.title}</span>
                </div>
              </div>
              <div className="os-singlethread-body">
                <div className="os-comment-list">
                  <div className="os-thread">
                    <img className="os-thread-avatar img-circle" width="40" height="40" src="https://s3.amazonaws.com/solomid-resources/overwatch/icons/Group+15.png"/>

                    <div className="os-thread-meta">
                      <h5 className="os-thread-title">{singleThread.meta.title}</h5>

                      <span className="os-thread-time">{moment(singleThread.createdAt).fromNow()} by </span>
                      <span className="os-thread-author">{singleThread.author.name} </span>

                      <p className="os-thread-content">{singleThread.content}</p>

                      <div className="os-comment-vote-score">
                        <div
                          className={upvotesClass}
                          onClick={this.handleVote.bind(null, singleThread._id, 'upvote')}
                        >
                          <i className={upvoteClass}></i>
                          &nbsp;
                          <span className={`jq-comment-upvote-${key}`}>{singleThread.score.upvotes}</span>
                        </div>
                        <div
                          className={downvotesClass}
                          onClick={this.handleVote.bind(null, singleThread._id, 'downvote')}
                        >
                          <i className={downvoteClass}></i>
                          &nbsp;
                          <span className={`jq-comment-downvote-${key}`}>{singleThread.score.downvotes}</span>
                        </div>
                        <div className="os-comment-btn-gray">
                          SHARE
                        </div>
                        <div className="os-comment-btn-gray">
                          REPORT
                        </div>
                      </div>

                    </div>
                  </div>
                  {this.renderCommentList()}
                </div>
                <div className="os-singlethread-actions">
                  <div className="os-thread-stats">
                    <span className="os-thread-views">
                      <i className="fa fa-eye"></i>
                      {singleThread.meta.views}
                    </span>
                    <span className="os-thread-attenders">
                      <i className="fa fa-comment-o"></i>
                      {singleThread.children?singleThread.children.length:0}
                    </span>
                  </div>
                  <div className="os-thread-reply">
                    <button
                      className="btn btn-primary os-btn-blue"
                      onClick={this.doReply.bind(null)}
                    >
                      <i className="fa fa-reply"></i> REPLY
                    </button>
                  </div>
                  {/*<div className="os-thread-favorite">
                      <button
                        className="btn btn-default os-btn-gray"
                        onClick={this.handleVote.bind(null, singleThread._id, 'upvote')}
                      >
                        <i className="fa fa-star-o"></i> FAVORITE
                      </button>
                    </div>*/}
                </div>
              </div>


              <div className="os-singlethread-footer">

                {this.renderEditModal()}
                {this.renderReplyForm(singleThread.meta.title, singleThread._id)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  doReply = () => {
    if(this.textarea)
      this.textarea.focus();
    else{
      window.scrollTo(0,30000);
    }
  };

  renderReplyForm = (threadTitle, threadId) => {

    const {
      dispatch,
      params: {
        commType
      }
    } = this.props;

    const localToken = localStorage.getItem('token');
    const localUsername = localStorage.getItem('username');
    const localUserId = localStorage.getItem('userId');

    return(
      <div className="os-reply-form" style={localToken?{}:{textAlign:'center'}}>
        <fieldset className="os-modal-form-group-1">
          <h4 className="os-modal-title">JOIN THE CONVERSATION</h4>
          {
            !localToken?
            <span className="os-modal-description">Please log in or sign up to join to conversation</span> :
            <span className="os-modal-description">Replying to "<b>{threadTitle}</b>"</span>
          }
        </fieldset>
        {
        localToken?
          <form onSubmit={e => {
              e.preventDefault();

              const textarea = this.textarea;
              if (textarea && textarea.value) {
                dispatch(addComment({
                  type: commType,
                  threadId,
                  content: textarea.value,
                  userId: localUserId,
                  userName: localUsername,
                  token: localToken
                }));
              }
              $(`#modal-add-thread`).modal('hide');
            }}>
            <fieldset className="os-modal-form-group-2">
              <textarea
                placeholder=""
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
              >ADD REPLY</button>
            </fieldset>
          </form>
        :
          <div>
            <button
              className="btn btn-primary os-btn-blue"
              data-toggle="modal"
              data-target="#sign-in"
            >
              LOG IN
            </button>
            <button
              className="btn btn-default os-btn-gray"
              data-toggle="modal"
              data-target="#sign-up"
            >
              SIGN UP
            </button>
          </div>
        }
      </div>
    );
  }

  renderCommentList = () =>{
    const {
      token,
      singleThread,
      isFetchingSingleThread
    } = this.props;

    if(isFetchingSingleThread || !singleThread || !singleThread.children){
      return;
    }

    const localUsername = localStorage.getItem('username');
    const localUserIsAdmin = localStorage.getItem('userIsAdmin');

    return(
      <div>
      {
        singleThread.children.map(comment => {
          const {
            _id,
            createdAt,

            meta:{
              title,
              views
            },
            score:{
              upvotes,
              downvotes
            },
            author:{
              id: authorId,
              name: authorName
            },
            content,
            deleted
          } = comment;

          if(deleted) return;
          if (!localStorage.getItem('commentVotes')) localStorage.setItem('commentVotes', JSON.stringify({}));
          const votes =  JSON.parse(localStorage.getItem('commentVotes'));
          const key = _id;
          const downvoteClass = classNames({
            'fa fa-fw': true,
            'fa-thumbs-o-down': true
          });

          const upvoteClass = classNames({
            'fa fa-fw': true,
            'fa-thumbs-o-up': true
          });

          const downvotesClass = classNames({
            'os-comment-vote-down': true,
            'os-comment-item-votes-active': votes[key],
            'os-comment-item-votes-non-active': !votes[key],
            'os-comment-voted-down': votes[key] == 'downvote'
          });

          const upvotesClass = classNames({
            'os-comment-vote-up': true,
            'os-comment-item-votes-active': votes[key],
            'os-comment-item-votes-non-active': !votes[key],
            'os-comment-voted-up': votes[key] == 'upvote'
          });

          return (
            <div className="os-comment"
              key={_id} 
              ref={ div => { this.commentDivs[_id] = div }} 
            >
              <img className="os-comment-avatar" width="40" height="40" src="https://s3.amazonaws.com/solomid-resources/overwatch/icons/Group+15.png"/>

              <div className="os-comment-meta">
                <h6 className="os-comment-author">{authorName}</h6>
                <span className="os-comment-time">{moment(createdAt).fromNow()} </span>
                <p className="os-comment-content">{content}</p>
                <div className="os-comment-vote-score">
                  <div
                    className={upvotesClass}
                    onClick={this.handleVote.bind(null, _id, 'upvote')}
                  >
                    <i className={upvoteClass}></i>
                    &nbsp;
                    <span className={`jq-comment-upvote-${key}`}>{upvotes}</span>
                  </div>
                  <div
                    className={downvotesClass}
                    onClick={this.handleVote.bind(null, _id, 'downvote')}
                  >
                    <i className={downvoteClass}></i>
                    &nbsp;
                    <span className={`jq-comment-downvote-${key}`}>{downvotes}</span>
                  </div>
                  <div className="os-comment-btn-gray"
                    onClick={this.doQuote.bind(null, content)}
                    >
                    <i className="fa fa-quote-left"></i> QUOTE
                  </div>
                  <div className="os-comment-btn-gray">
                    SHARE
                  </div>
                  <div className="os-comment-btn-gray">
                    REPORT
                  </div>
                </div>
              </div>
              <div className="os-comment-ed-control">
              {
                localUsername == authorName || localUserIsAdmin == "true" ?
                  <EditDeleteButton
                    id = {_id}
                    editable = {localUserIsAdmin != "true" || localUsername==authorName}
                    deleteHandle = {this.handleDelete}
                    editHandle = {this.handleEdit}
                  />
                :null
              }
              </div>
            </div>
          );
        })
      }
      </div>
    );
  };

  handleEdit = (id)=>{
    const {
      singleThread: {
        children: comments
      }
    } = this.props;
    this._commentInput.value = id;
    this._commentEditBox.value = comments.find(x => x._id === id).content;
    $(`#modal-edit-comment`).modal('show');
  }

  handleDelete = (id) => {
    const {
      dispatch
    } = this.props;

    const localToken = localStorage.getItem('token');

    dispatch(deleteCommunityComment({
      id,
      token: localToken
    }));
    this.commentDivs[id].style.display = 'none';
  }

  renderEditModal = () => {
    const {
      dispatch
    } = this.props;

    const localToken = localStorage.getItem('token');
    if(localToken){
      return (
        <div>
          <Modal 
            id={`modal-edit-comment`}
          >
            <form onSubmit={e => {
              e.preventDefault();
              const textarea = this._commentEditBox;
              const input = this._commentInput;
              if (textarea && textarea.value && input && input.value) {
                dispatch(editCommunityComment({
                  id: input.value,
                  content: textarea.value,
                  token: localToken
                }));
              }

              this.props.singleThread.children.find(x => x._id === input.value).content = textarea.value;

              let editedComment = this.commentDivs[input.value];
              editedComment.getElementsByClassName("os-comment-content")[0].innerHTML = textarea.value;
              $(`#modal-edit-comment`).modal('hide');
            }}>
              <fieldset className="os-modal-form-group-1">
                <h4 className="os-modal-title">EDIT COMMENT</h4>
              </fieldset>
              <fieldset className="os-modal-form-group-2">
                <input type="hidden" ref={c => this._commentInput = c} />
                <textarea
                  className="form-control os-textarea"
                  ref={c => this._commentEditBox = c}
                  rows={9}
                />
              </fieldset>
              <fieldset className="os-modal-form-group-2">
                <button
                  className="btn btn-primary os-btn-blue"
                  type="submit"
                >SAVE</button>
              </fieldset>
            </form>
          </Modal>
        </div>
      );
    }
  };

  doQuote = (content) => {
    if(this.textarea){
      this.textarea.value = content;
      this.textarea.focus();
    }
  }

  handleVote = (commentId, downOrUp) => {
    const {
      dispatch
    } = this.props;

    const votes = JSON.parse(localStorage.getItem('commentVotes'));
    const key = commentId;
    if (!votes[key]) {
      dispatch(voteComment(commentId, downOrUp));

      const selector = `.jq-comment-${downOrUp}-${key}`;
      const score = parseInt($(selector).text());
      $(selector).text(score + 1);

      const otherDownOrUp = downOrUp === 'downvote' ? 'upvote' : 'downvote';
      const otherSelector = `.jq-comment-${otherDownOrUp}-${key}`;

      $(selector).parent().addClass('os-comment-item-votes-active');
      $(otherSelector).parent().addClass('os-comment-item-votes-active');
      $(selector).parent().removeClass('os-comment-item-votes-non-active');
      $(otherSelector).parent().removeClass('os-comment-item-votes-non-active');

      const votedItemClass = downOrUp === 'upvote'? 'up' : 'down';
      $(selector).parent().addClass(`os-comment-voted-${votedItemClass}`);
      
      votes[key] = downOrUp;
      localStorage.setItem('commentVotes', JSON.stringify(votes));
    }
  };
}

function mapStateToProps (state) {
  const {
    auth: {
      token
    },
    community: {
      singleThread: {
        singleThread: singleThreadData,
        isFetching: isFetchingSingleThread
      }
    }
  } = state;

  return {
    token,
    singleThread: singleThreadData,
    isFetchingSingleThread
  };
}

export default connect(mapStateToProps)(SingleThreadPage);
