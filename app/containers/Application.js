import React from 'react'
import { Provider } from 'react-redux';
<<<<<<< HEAD
//import ReactGA from 'react-ga';
<<<<<<< Updated upstream
import Home from '../components/pages/Home/Home';
import Root from './Root';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
=======
import Root from './Root';
=======
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
//import ReactGA from 'react-ga';
import Root from './root';
>>>>>>> 90c3db1c279916d94397720a7b0a7391a7cef4fc
import ForgotPassword from '../components/pages/password/forgot';
import ResetPassword from '../components/pages/password/reset';
import Heros from '../components/pages/hero/heros';
import Hero from '../components/pages/hero/hero';
import HeroTips from '../components/pages/hero/herotips';
<<<<<<< HEAD
>>>>>>> Stashed changes
=======
>>>>>>> 90c3db1c279916d94397720a7b0a7391a7cef4fc

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
      <IndexRoute component={Hero} />
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
