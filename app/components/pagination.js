import React from 'react';
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

const PAGINATION_LINK_COUNT = 10;

class Pagination extends Component {
  render () {
    const {
      activePage,
      baseUrl,
      limit,
      itemCount,
      itemText
    } = this.props;

    let pages = [];
    let basePageCount = activePage > Math.floor(PAGINATION_LINK_COUNT / 2) ? activePage - Math.floor(PAGINATION_LINK_COUNT / 2) : 1;

    for (let i = 0; i < PAGINATION_LINK_COUNT; i++) {
      const isDisabled = !!(pageCount >= Math.floor(itemCount / limit));
      const pageCount = basePageCount + i;
      const pageItemClass = classNames({
        'page-item': true,
        'active': pageCount === activePage,
        'disabled': isDisabled
      });

      const pageItemElement = isDisabled ?
        null
      : (
        <Link
          className="page-link"
          to={{
            pathname: baseUrl,
            query: {
              page: pageCount
            }
          }}
          key={pageCount}
        >{pageCount}</Link>
      );

      const page = (
        <li className={pageItemClass} key={i}>
          {pageItemElement}
        </li>
      );

      pages.push(page);
    }

    const previousPageCount = activePage > 1 ? activePage - 1 : 1;
    const nextPageCount = activePage >= Math.floor(itemCount / limit) ? activePage : activePage + 1;

    return (
      <nav
        className="text-xs-center"
        aria-label="Page navigation"
      >
        <ul className="os-pagination">
          <li className="prev-item">
            <Link
              className="btn btn-default os-btn-gray"
              aria-label="Previous"
              to={{
                pathname: baseUrl,
                query: {
                  page: previousPageCount
                }
              }}
            >
              NEWER {itemText}
            </Link>
          </li>
          <div className="os-page-items">
            {pages}
          </div>
          <li className="next-item">
            <Link
              className="btn btn-default os-btn-gray"
              aria-label="Next"
              to={{
                pathname: baseUrl,
                query: {
                  page: nextPageCount
                }
              }}
            >
              OLDER {itemText}
            </Link>
          </li>
        </ul>
      </nav>
    );
  }
}

export default connect()(Pagination);
