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
import PageNotFound from '../components/pages/notfound/PageNotFound';

export const routes = (
  <Route path="/" component={Root} onChange={handleChangePage}>
    <IndexRoute component={HomePage} />
    <Route path="/forgot" component={ForgotPassword} />
    <Route path="/reset" component={ResetPassword} />
    <Route path="/heroes" component={HomePage} />
    <Route path="/heroes/:heroType" component={HomePage} />


    <Route path="/hero/:heroKey" component={SingleHeroPage}>
      <IndexRoute component={GeneralTipsPage} />
      <Route path="/hero/:heroKey/generaltips" component={GeneralTipsPage}/>
      <Route path="/hero/:heroKey/matchups" component={HeroMatchupsPage}/>
      <Route path="/hero/:heroKey/maprankings" component={MapRankingsPage}/>
      <Route path="/maprankingtips/:heroKey/:mapKey" component={MapRankingTipsPage}/>
    </Route>

    <Route path="/matchuptips/:heroKey/:matchupHeroKey/:matchupType" component={MatchupTipsPage}>
      <IndexRoute component={MatchupTips} />
    </Route>

    <Route path="/maps" component={MapsPage} />
    <Route path="/maps/:mapType" component={MapsPage} />
    <Route path="/map/:mapKey" component={MapTipsPage} />

    <Route path="/community" component={CommunityPage} />
    <Route path="/community/:commType" component={ThreadsListPage} />
    <Route path="/community/:commType/:threadId" component={SingleThreadPage} />
    <Route status={404} path="*" component={PageNotFound} />
  </Route>
);

var stateChanged = "page";
var scrollTop = 0;
function handleChangePage(prevState, nextState, replaceState, callback){
  if(('heroType' in nextState.params 
      || 'mapType' in nextState.params 
      || nextState.location.pathname.includes('generaltips')
      || nextState.location.pathname.includes('matchups')
      || nextState.location.pathname.includes('maprankings')) && $('.os-tab-transition').length != 0)
  {
    stateChanged = "tab";
    scrollTop = $(window).scrollTop();
    $('.os-tab-transition').fadeOut(500, function(){
      callback();
    });
  }
  else{
    stateChanged = "page";
    $('.os-transition').fadeOut(500, function(){
      callback();
    }); 
  }
}

function handlePageView(e) {
  if(stateChanged == "tab"){
    $('.os-tab-transition').css('display', 'block');
    $('.os-tab-transition').css('opacity', '0');
    $(window).scrollTop(scrollTop);  
    $('.os-tab-transition').animate({ opacity: 1 }, 500);
  }
  else{
    $('.os-transition').css('display', 'none');
    $('.os-transition').fadeIn(500);  
  }
}

export default class Application extends React.Component {
  render () {
    return (
      <Provider store={ this.props.store }>
        <Router history={ this.props.history } onUpdate={handlePageView}>
          {routes}
        </Router>
      </Provider>
    )
  }
}
