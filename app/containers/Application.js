import React from 'react'
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import Root from './Root';

import ForgotPassword from '../components/pages/password/forgot';
import ResetPassword from '../components/pages/password/reset';
import HomePage from '../components/pages/hero/homepage';
import MapsPage from '../components/pages/map/mapspage';
import SingleHeroPage from '../components/pages/hero/singleheropage';
import GeneralTipsPage from '../components/pages/tip/generaltipspage';
import HeroMatchupsPage from '../components/pages/matchup/heromatchupspage';
import MapRankingsPage from '../components/pages/map/maprankingspage';
import MapRankingTipsPage from '../components/pages/map/maprankingtipspage';
import MatchupTipsPage from '../components/pages/matchup/matchuptipspage';
import MatchupTips from '../components/pages/matchup/matchuptips';
import MapTipsPage from '../components/pages/map/maptipspage';
import CommunityPage from '../components/pages/community/communitypage';
import ThreadsListPage from '../components/pages/thread/threadslistpage';
import SingleThreadPage from '../components/pages/thread/singlethreadpage';

export const routes = (
  <Route path="/" component={Root} >
    <IndexRoute component={HomePage} />
    <Route path="/forgot" component={ForgotPassword} />
    <Route path="/reset" component={ResetPassword} />
    <Route path="/heroes" component={HomePage} />

    <Route path="/heroes/:heroKey" component={SingleHeroPage}>
      <IndexRoute component={GeneralTipsPage} />
      <Route path="/heroes/:heroKey/generaltips" component={GeneralTipsPage}/>
      <Route path="/heroes/:heroKey/matchups" component={HeroMatchupsPage}/>
      <Route path="/heroes/:heroKey/maprankings" component={MapRankingsPage}/>
      <Route path="/maprankingtips/:heroKey/:mapKey" component={MapRankingTipsPage}/>
    </Route>

    <Route path="/matchups/:heroKey/:matchupHeroKey/:matchupType" component={MatchupTipsPage}>
      <IndexRoute component={MatchupTips} />
    </Route>

    <Route path="/maps" component={MapsPage} />
    <Route path="/maps/:mapKey" component={MapTipsPage} />

    <Route path="/community" component={CommunityPage} />
    <Route path="/community/:commType" component={ThreadsListPage} />
    <Route path="/community/:commType/:threadId" component={SingleThreadPage} />
  </Route>
);

export default class Application extends React.Component {

  handlePageView() {
    if (window !== undefined) {
      window.scrollTo(0, 0);
    }
  }

  render () {
    return (
      <Provider store={ this.props.store }>
        <Router history={ this.props.history } onUpdate={() => this.handlePageView()}>
          {routes}
        </Router>
      </Provider>
    )
  }
}
