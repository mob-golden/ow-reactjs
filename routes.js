//================= OVERWATCH BACKEND API ===============================//
export const OW_API_ROOT = `https://overwatch-select-api-dev.herokuapp.com`;
export const OW_HEROES_URL = `${OW_API_ROOT}/heroes`;
export const OW_MAPS_URL = `${OW_API_ROOT}/maps`;
export const OW_COUNTER_TIPS_URL = `${OW_API_ROOT}/countertips`;
export const OW_HERO_URL = `${OW_API_ROOT}/hero`;
export const OW_MAP_URL = `${OW_API_ROOT}/map`;
export const OW_TIPS_URL = `${OW_API_ROOT}/tips`;
export const OW_MATCHUPS_URL = `${OW_API_ROOT}/matchups`;
import request from 'request';
var qs = require('qs');
//================= SOLOMID DISCUSSION API ==============================//
// export const OW_COMMUNITY_URL = `http://discussion.solomid.net`;
// export const OW_COMMUNITY_URL = `http://alejandro-discussion.herokuapp.com`;
export const OW_COMMUNITY_URL = `http://discussion-gamma.herokuapp.com`;

module.exports =  function(app){
    // app.get('/api/heroes',(req,res,next)=>{
    //   const url = `${OW_HEROES_URL}?${req.query}`;
    //   return fetch(url)
    //     .then(response => response.json())
    //     .then(json => res.json(json))
    //     .catch (error => {
    //       console.log(`Request failed for ${url}: ${error.message}`);
    //     });
    // });
    //
    // app.get('/api/maps',(req,res,next)=>{
    //   const url = `${OW_MAPS_URL}?${req.query}`;
    //   return fetch(url)
    //     .then(response => response.json())
    //     .then(json => res.json(json))
    //     .catch (error => {
    //       console.log(`Request failed for ${url}: ${error.message}`);
    //     });
    // });
    //
    // app.get('/api/hero/:hero',(req,res,next)=>{
    //   console.log(req.params);
    //   const url = `${OW_HERO_URL}/${req.params.hero}?${req.query}`;
    //   return fetch(url)
    //     .then(response => response.json())
    //     .then(json => res.json(json))
    //     .catch (error => {
    //       console.log(`Request failed for ${url}: ${error.message}`);
    //     });
    // });
    // app.get('/api/map/:mapKey',(req,res,next)=>{
    //   console.log(req.params);
    //   const url = `${OW_MAP_URL}/${req.params.mapKey}?${req.query}`;
    //   return fetch(url)
    //     .then(response => response.json())
    //     .then(json => res.json(json))
    //     .catch (error => {
    //       console.log(`Request failed for ${url}: ${error.message}`);
    //     });
    // });
    //
    function handleProxy(url,req,res){
      console.log(req.url);
      var headers = {};
      var r = null;
      console.log(url);
      try{
      ['accept','content-type','authorization'].forEach(function(key){
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
