/*import fetch from 'isomorphic-fetch';
import qs from 'querystring';

export function updateCache() {
  return (dispatch) => {
    const TEN_SECONDS = 10000;
    console.log('update cache');
    let shortExpiry = localStorage.getItem('expiry-matchups');

    if (!shortExpiry || shortExpiry < Date.now()) {
      localStorage.setItem('expiry-matchups', Date.now() + TEN_SECONDS);
      console.log('purge');
      // Purge
      fetch(`/updatecache`);
    } else {

    }

  }
}*/
//TODO
