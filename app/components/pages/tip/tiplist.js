import React from 'react';
import changeCase from 'change-case';
import classNames from 'classnames';

import {
  Component,
  PropTypes
} from 'react';

import {
  connect
} from 'react-redux';

import {
  Link
} from 'react-router';

import {
  voteTip
} from '../../../actions/all';

import TipUDControl from './tipudcontrol';

class TipList extends Component {

  constructor(props) {
    super(props);

    this.toggleTipShowMore = this.toggleTipShowMore.bind(this);
  }

  toggleTipShowMore (e) {
    $(e.target).toggleClass("os-counter-tip-text-short").toggleClass("os-counter-tip-text-long");
  }

  render () {
    const {
      tips,
      firstText
    } = this.props;

    if (!localStorage.getItem('tipVotes')) localStorage.setItem('tipVotes', JSON.stringify({}));

    const localUsername = localStorage.getItem('username');

    const votes =  JSON.parse(localStorage.getItem('tipVotes'));

    if (tips.length === 0) {
      return (
        <div className="os-counter-tips-list">
          <div className="os-alert-warning">{firstText}</div>
        </div>
      );
    }

    return (
      <div className="os-counter-tips-list">
        {tips.map(tip => {
          const {
            _id: id,
            authorName,
            type,
            contentRaw: content,
            createdAt,
            score: {
              upvotes,
              downvotes,
              total: scoreTotal
            }
          } = tip;

          const name = authorName ? authorName : 'anonymous';

          const downvoteClass = classNames({
            'fa fa-fw fa-caret-down': true,
            'os-counter-tip-caret': true,
            'os-counter-tip-caret-non-active': !votes[id],
            'os-counter-tip-caret-active': votes[id] === 'downvote',
            'os-counter-tip-vote-alt': true,
            'os-counter-tip-vote-non-active-alt': !votes[id],
            'os-counter-tip-vote-active-alt': votes[id] === 'downvote'
          });

          const upvoteClass = classNames({
            'fa fa-fw fa-caret-up': true,
            'os-counter-tip-caret': true,
            'os-counter-tip-caret-non-active': !votes[id],
            'os-counter-tip-caret-active': votes[id] === 'upvote',
            'os-counter-tip-vote-alt': true,
            'os-counter-tip-vote-non-active-alt': !votes[id],
            'os-counter-tip-vote-active-alt': votes[id] === 'upvote'
          });


          let tipTextLongHelper = null;
          if (content.length > 800) 
            tipTextLongHelper = <div className="os-counter-tip-footer clearfix os-counter-tip-text-long-helper">Click tip to expand</div>;

          let tipTextShortHelper = null;
          if (content.length > 800) 
            tipTextShortHelper = <div className="os-counter-tip-footer clearfix os-counter-tip-text-short-helper">Click tip again to shrink</div>;

          let osTipOnClick = (content.length > 800) ? (e) => this.toggleTipShowMore(e) : () => {};
          const contentElement = (
            <div>
              <p
                className="os-counter-tip-text os-counter-tip-text-short"
                onClick={osTipOnClick}
                dangerouslySetInnerHTML={{
                  __html: content
                }}
              >
              </p>
              {tipTextLongHelper}
              {tipTextShortHelper}
              <div className="os-counter-tip-footer clearfix">
                <span className="os-counter-tip-metadata">by <span className="os-counter-tip-author">{name}</span></span>
              </div>
            </div>
          );

          return (
            <div
              className="os-counter-tip"
              key={id}
            >
              <div className="os-counter-tip-score-alt">
                <div className="os-counter-tip-vote-alt os-counter-tip-upvote-alt">
                  <i
                    className={upvoteClass}
                    onClick={this.handleVote.bind(null, id, 'upvote')}
                  ></i>
                </div>
                {/* <span className={`jq-counter-tip-${id} hidden-xs-up`}></span> */}
                <p className={`os-counter-tip-total-alt jq-counter-tip-${id}`}>{scoreTotal}</p>
                <div className="os-counter-tip-vote-alt os-counter-tip-downvote-alt">
                  <i
                    className={downvoteClass}
                    onClick={this.handleVote.bind(null, id, 'downvote')}
                  ></i>
                </div>
              </div>
              <div className="os-counter-tip-content">
                {contentElement}
              </div>
              <div className="os-counter-tip-ud-control">
                {
                  localUsername == authorName?
                    <TipUDControl/>
                  :null
                }
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  handleVote = (id, downOrUp) => {
    const {
      dispatch
    } = this.props;

    const votes = JSON.parse(localStorage.getItem('tipVotes'));

    if (!votes[id]) {
      dispatch(voteTip(id, downOrUp));

      const selector = `.jq-counter-tip-${id}`;
      const score = parseInt($(selector).text());
      if (downOrUp === 'downvote') {
        $(selector).text(score - 1)

        $(selector).next().find('i').addClass('os-counter-tip-caret-active');
        $(selector).next().find('i').addClass('os-counter-tip-vote-active-alt');
      } else if (downOrUp === 'upvote') {
        $(selector).text(score + 1)

        $(selector).prev().find('i').addClass('os-counter-tip-caret-active');
        $(selector).prev().find('i').addClass('os-counter-tip-vote-active-alt');
      }

      $(selector).prev().find('i').removeClass('os-counter-tip-vote-non-active-alt');
      $(selector).next().find('i').removeClass('os-counter-tip-vote-non-active-alt');
    
      votes[id] = downOrUp;
      localStorage.setItem('tipVotes', JSON.stringify(votes));
    }
  };
}

export default connect()(TipList);
