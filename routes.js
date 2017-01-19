//================= OVERWATCH BACKEND API ===============================//
var kue = require('kue');
export const OW_API_ROOT = `https://overwatch-select-api-prod.herokuapp.com`;
export const OW_HEROES_URL = `${OW_API_ROOT}/heroes`;
export const OW_MAPS_URL = `${OW_API_ROOT}/maps`;
export const OW_COUNTER_TIPS_URL = `${OW_API_ROOT}/countertips`;
export const OW_HERO_URL = `${OW_API_ROOT}/hero`;
export const OW_MAP_URL = `${OW_API_ROOT}/map`;
export const OW_TIPS_URL = `${OW_API_ROOT}/tips`;
export const OW_MATCHUPS_URL = `${OW_API_ROOT}/matchups`;
//================ OVERWATCH WEBSITE LINKS ===========================//
export const OW_PRE_PROTOCOL_WEB_ROOT = process.env.FORCE_DOMAIN || `www.overwatchelite.net`;
export const OW_WEB_ROOT = `http://${OW_PRE_PROTOCOL_WEB_ROOT}`;
export const OW_WEB_HEROES_URL = `${OW_WEB_ROOT}/heroes`; //year
export const OW_WEB_MAPS_URL = `${OW_WEB_ROOT}/maps`; //year
export const OW_WEB_COUNTER_TIPS_URL = `${OW_WEB_ROOT}/countertips`;
export const OW_WEB_HERO_URL = `${OW_WEB_ROOT}/hero`; //year
export const OW_WEB_MAP_URL = `${OW_WEB_ROOT}/map`; //year
export const OW_WEB_TIPS_URL = `${OW_WEB_ROOT}/tips`;
export const OW_WEB_MATCHUPS_URL = `${OW_WEB_ROOT}/matchups`;
export const OW_LOCALAPI_URL = `${OW_WEB_ROOT}/api`
//maps, heroes, tips, countertips,
const debug = require('debug')('app:log');
var FastlyPurge = require('fastly-purge');
var FASTLY_API_KEY = process.env.FASTLY_API_KEY;
var FASTLY_SERVICE_ID = process.env.FASTLY_SERVICE_ID;
var fastlyPurge = new FastlyPurge(`${process.env.FASTLY_API_KEY}`);
import request from 'request';
var qs = require('qs');
export const OW_COMMUNITY_URL = `http://discussion-gamma.herokuapp.com`;
export const S_IN_YR = 31536000;
export const S_IN_FM = 300;

var queue = kue.createQueue({
    prefix: 'OW_QUEUE_',
    redis: {
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
        auth: process.env.REDIS_PASS
    }
});

function getCustomHeaders({url,method}){
  const res ={};
  if(method=='GET'){
    if(url.includes(OW_WEB_HEROES_URL) || url.includes(OW_WEB_MAPS_URL) || url.includes(OW_WEB_HERO_URL)|| url.includes(OW_WEB_MAP_URL)){
      res['Cache-Control'] = `max-age=${S_IN_YR}`;
    }
    else if(url.includes(OW_LOCALAPI_URL)){
      res['Cache-Control'] = `max-age=${S_IN_FM}`;
    }
  }
  return res;
}

module.exports =  function(app){
    function handleProxy(originalUrl,url,req,res){
      var headers = {};
      var r = null;
      let isLoggedIn = false;
      if(typeof req.session.user_id !== 'undefined' && typeof req.session.token !== 'undefined'){
        debug(`session exists`);
        debug(req.session);
        isLoggedIn = true;
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
          const purgeURL= `${OW_WEB_ROOT}/api${originalUrl}`;
          queue.create('postReq', {url: purgeURL}).save();
          if(headers['content-type'] && headers['content-type'].includes('x-www-form-urlencoded')){
            r = request.post({uri: url, headers: headers, form: qs.stringify(req.body)});
          }else{
            r = request.post({uri: url, headers: headers, json: req.body});
          }
          req.pipe(r,{end:false}).pipe(res);

        } else if(req.method==='PUT') {
          const purgeURL= `${OW_WEB_ROOT}/api${originalUrl}`;
          queue.create('putReq', {url: purgeURL}).save();
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
          const customHeaders = getCustomHeaders({url,method : req.method});
          Object.entries(customHeaders).forEach(([key,value])=>{
            res.setHeader(key,value);
          });
          req.pipe(r).pipe(res);
        }


      }catch(e){
        console.log(e);
        res.send('We messed up');
      }
    }
    app.use('/api', function(req, res) {
      var url =  OW_API_ROOT + req.url;
      handleProxy(req.url, url,req,res);
    });
    app.use('/communityapi',function(req,res){
      var url =  OW_COMMUNITY_URL + req.url;
      handleProxy(url,req,res);
    });
};
