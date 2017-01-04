require("./styles/main.scss");

import React from 'react';
import { render } from 'react-dom';
import initialization from './store/initialization';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import Application from './containers/Application';

const preloadedState = window.__PRELOADED_STATE__;
const store = initialization(preloadedState);
const history = syncHistoryWithStore(browserHistory, store);

render(
  <Application store={store} history={history} />,
    document.getElementById('container')
);
