import React from 'react'
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
//import ReactGA from 'react-ga';
import Root from './root';
import ForgotPassword from '../components/pages/password/forgot';
import ResetPassword from '../components/pages/password/reset';
import Heros from '../components/pages/hero/heros';
import Hero from '../components/pages/hero/hero';

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
    />
    <Route
      component={Hero}
      path="/heros/:heroKey"
    >
      <IndexRoute component={Hero} />
    </Route>*/}
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