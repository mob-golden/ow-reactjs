import React from 'react'
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
//import ReactGA from 'react-ga';
import Root from './Root';

import ForgotPassword from '../components/pages/password/forgot';
import ResetPassword from '../components/pages/password/reset';
import Heros from '../components/pages/hero/heros';
import Hero from '../components/pages/hero/hero';
import HeroTips from '../components/pages/hero/herotips';
import HeroMatchups from '../components/pages/hero/heromatchups';

//if (typeof window !== 'undefined')  {
//  ReactGA.initialize('UA-51583717-1');
//}
export const routes = (
  <Route path="/" component={Root} >
    <IndexRoute component={Heros} />
    <Route path="/forgot" component={ForgotPassword} />
    <Route path="/reset" component={ResetPassword} />
    <Route path="/heros" component={Heros} />
    {/*<Route
      component={Maps}
      path="/maps"
    />*/}

    <Route path="/heros/:heroKey" component={Hero}>
      <IndexRoute component={HeroTips} />
      <Route path="/heros/:heroKey/generaltips" component={HeroTips}/>
      <Route path="/heros/:heroKey/matchups" component={HeroMatchups}/>
    </Route>
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
