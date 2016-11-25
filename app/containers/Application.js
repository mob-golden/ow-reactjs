import React from 'react'
import { Provider } from 'react-redux';
//import ReactGA from 'react-ga';
import Root from './Root';
import ForgotPassword from '../src/pages/password/forgot';
import ResetPassword from '../src/pages/password/reset';
import Heros from '../src/pages/hero/heros';
// import Maps from '../src/pages/map/maps';

import { Router, Route, IndexRoute, browserHistory } from 'react-router';

//if (typeof window !== 'undefined')  {
//  ReactGA.initialize('UA-51583717-1');
//}
export const routes = (
  <Route path="/" component={Root} >
    <IndexRoute component={Heros} />
    <Route
      component={ForgotPassword}
      path="/forgot"
    />
    <Route
      component={ResetPassword}
      path="/reset"
    />
    <Route
      component={Heros}
      path="/heros"
    />
    {/*<Route
      component={Maps}
      path="/maps"
    />*/}
  </Route>
);

export default class Application extends React.Component {
  render () {
    return (
      <Provider store={ this.props.store }>
        <Router history={ this.props.history }> 
          {routes}
        </Router>
      </Provider>
    )
  }
}
//add this when pushing to prod  onUpdate={() => this.handlePageView()}