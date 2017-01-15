import React from 'react';
import classNames from 'classnames';
import changeCase from 'change-case';

import {
  Link
} from 'react-router';

const TabsNav = props => {
  const {
    tabs,
    activeType
  } = props;

  return (
    <ul className="os-tabs-nav">
      {tabs.map(tab => {
        const {
          label,
          link,
          name
        } = tab;

        const navItemClass = classNames({
          'os-tabnav-item': true,
          'active': name === activeType
        });

        const renderLink = () => {
          return (
            <a
              className="os-nav-link os-font-size-12"
              href={link}
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
            key={name}
          >
            {renderLink()}
          </li>
        );
      })}
    </ul>
  );
};

export default TabsNav;
