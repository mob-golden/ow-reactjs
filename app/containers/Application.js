import React from 'react'
import { Provider } from 'react-redux';
//import ReactGA from 'react-ga';
import Heros from '../src/pages/home/heros';
import Root from './Root';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

//if (typeof window !== 'undefined')  {
//  ReactGA.initialize('UA-51583717-1');
//}
export const routes = (
  <Route path="/" component={Root} >
    <IndexRoute component={Heros} />
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