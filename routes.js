//================= OVERWATCH BACKEND API ===============================//
export const OW_API_ROOT = `https://overwatch-select-api-prod.herokuapp.com`;
export const OW_HEROES_URL = `${OW_API_ROOT}/heroes`; // 30 days
export const OW_MAPS_URL = `${OW_API_ROOT}/maps`; // 30 days
export const OW_COUNTER_TIPS_URL = `${OW_API_ROOT}/countertips`; // 5 min
export const OW_HERO_URL = `${OW_API_ROOT}/hero`; // 30 days
export const OW_MAP_URL = `${OW_API_ROOT}/map`; // 30 days
export const OW_TIPS_URL = `${OW_API_ROOT}/tips`; // 5 min
export const OW_MATCHUPS_URL = `${OW_API_ROOT}/matchups`; // 5 min
const debug = require('debug')('app:log');

import request from 'request';
var qs = require('qs');
//================= SOLOMID DISCUSSION API ==============================//
// export const OW_COMMUNITY_URL = `http://discussion.solomid.net`;
// export const OW_COMMUNITY_URL = `http://alejandro-discussion.herokuapp.com`;
export const OW_COMMUNITY_URL = `http://discussion-gamma.herokuapp.com`;

module.exports =  function(app){
    function handleProxy(url,req,res){
      var headers = {};
      var r = null;
      if(typeof req.session.user_id !== 'undefined' && typeof req.session.token !== 'undefined'){
        debug(`session exists`);
        debug(req.session);
        headers['authorization'] = req.session.token;
      }else{
        debug(`session does not exist`);
        debug(req.session)
      }
      try{
        ['accept','content-type'].forEach(function(key){
          if(req.headers[key]){
            headers[key] = req.headers[key];
          }
        });
        console.log(req.method);
        console.log(req.body);
        if(req.method === 'POST') {
          if(headers['content-type'] && headers['content-type'].includes('x-www-form-urlencoded')){
            r = request.post({uri: url, headers: headers, form: qs.stringify(req.body)});
          }else{
            r = request.post({uri: url, headers: headers, json: req.body});
          }
          req.pipe(r,{end:false}).pipe(res);

        } else if(req.method==='PUT') {
          if(headers['content-type'] && headers['content-type'].includes('x-www-form-urlencoded')){
            console.log(req.body);
            console.log('must send put formdata');
            console.log(qs.stringify(req.body));
            r = request.put({uri: url, headers: headers, form: qs.stringify(req.body)});
          }else{
            r = request.put({uri: url, headers: headers, json: req.body});
          }
          req.pipe(r,{end:false}).pipe(res);

        }else{
          r = request({uri : url, headers: headers});
          req.pipe(r).pipe(res);
        }


      }catch(e){
        console.log(e);
        res.send('We messed up');
      }
    }
    app.use('/api', function(req, res) {
      var url =  OW_API_ROOT + req.url;
      handleProxy(url,req,res);
    });
    app.use('/communityapi',function(req,res){
      var url =  OW_COMMUNITY_URL + req.url;
      handleProxy(url,req,res);
    });
};
