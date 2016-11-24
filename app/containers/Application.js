import React from 'react'
import { Provider } from 'react-redux';
//import ReactGA from 'react-ga';
import Home from '../components/pages/Home/Home';
import Root from './Root';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

//if (typeof window !== 'undefined')  {
//  ReactGA.initialize('UA-51583717-1');
//}
export const routes = (
  <Route path="/" component={Root} >
    <IndexRoute component={Home} />
  </Route>
);

export default class Application extends React.Component {

//  handlePageView () {
//    if (window !== undefined) {
//      ReactGA.set({ page: window.location.pathname });
//      ReactGA.pageview(window.location.pathname);
//      window.scrollTo(0, 0);
//    }
//  }
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