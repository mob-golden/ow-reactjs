import React from 'react';
import classNames from 'classnames';

import {
  Link
} from 'react-router';

const TabsNav = props => {
  const {
    activeTabId,
    handleClick,
    tabs
  } = props;

  return (
    <ul className="os-tabs-nav">
      {tabs.map(tab => {
        const {
          id: tabId,
          label,
          location
        } = tab;

        const navLinkClass = classNames({
          'os-nav-link': true,
          'os-font-size-12': true,
          'os-white': true,
          'active': tabId === activeTabId
        });

        const renderLink = () => {
          if (location) {
            return (
              <Link
                className={navLinkClass}
                to={`${location}`}
              >
                {label}
              </Link>
            );
          }

          return (
            <a
              className={navLinkClass}
              href="javascript:;"
              onClick={handleClick.bind(null, tabId)}
            >{label}</a>
          );
        };

        return (
          <li
            className="os-tabnav-item"
            key={tabId}
          >
            {renderLink()}
          </li>
        );
      })}
    </ul>
  );
};

export default TabsNav;
