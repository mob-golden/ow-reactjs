import React from 'react';
import { Link, browserHistory } from 'react-router';

export default ({ children }) => {
  return(
    <div className="home">
      {children}
    </div>
  );
};
