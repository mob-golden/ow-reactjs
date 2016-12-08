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

        const navItemClass = classNames({
          'os-tabnav-item': true,
          'active': tabId === activeTabId
        });

        const renderLink = () => {
          return (
            <a
              className="os-nav-link os-font-size-12"
              href="javascript:;"
              onClick={handleClick.bind(null, tabId)}
            >
              <div className={`os-tab-item-${label} os-tab-icon`}></div>
              <div className="os-tab-text">
                {label}
              </div>
            </a>
          );
        };

        return (
          <li
            className={navItemClass}
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
