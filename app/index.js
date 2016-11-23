require("./styles/main.scss");

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { state } from './store/base';
import { createStore } from 'redux';
import initialization from './store/initialization';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import Application from './containers/Application';

const store = initialization(state);
const history = syncHistoryWithStore(browserHistory, store);

render(
  <Application store={store} history={history} />,
    document.getElementById('container')
);
