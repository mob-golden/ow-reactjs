//================= OVERWATCH BACKEND API ===============================//
import kue from'kue';
export const OW_API_ROOT = `https://overwatch-select-api-prod.herokuapp.com`;
export const OW_HEROES_URL = `${OW_API_ROOT}/heroes`;
export const OW_MAPS_URL = `${OW_API_ROOT}/maps`;
export const OW_COUNTER_TIPS_URL = `${OW_API_ROOT}/countertips`;
export const OW_HERO_URL = `${OW_API_ROOT}/hero`;
export const OW_MAP_URL = `${OW_API_ROOT}/map`;
export const OW_TIPS_URL = `${OW_API_ROOT}/tips`;
export const OW_MATCHUPS_URL = `${OW_API_ROOT}/matchups`;
//================ OVERWATCH WEBSITE LINKS ===========================//
export const OW_PRE_PROTOCOL_WEB_ROOT = `www.overwatchelite.net`;
export const OW_WEB_ROOT = `http://${OW_PRE_PROTOCOL_WEB_ROOT}`;
export const OW_WEB_HEROES_URL = `${OW_WEB_ROOT}/heroes`; //year
export const OW_WEB_MAPS_URL = `${OW_WEB_ROOT}/maps`; //year
export const OW_WEB_COUNTER_TIPS_URL = `${OW_WEB_ROOT}/countertips`;
export const OW_WEB_HERO_URL = `${OW_WEB_ROOT}/hero`; //year
export const OW_WEB_MAP_URL = `${OW_WEB_ROOT}/map`; //year
export const OW_WEB_TIPS_URL = `${OW_WEB_ROOT}/tips`;
export const OW_WEB_MATCHUPS_URL = `${OW_WEB_ROOT}/matchups`;
export const OW_LOCALAPI_URL = `${OW_WEB_ROOT}/api`;
//maps, heroes, tips, countertips,
const debug = require('debug')('app:log');
import FastlyPurge from 'fastly-purge';
const FASTLY_API_KEY = process.env.FASTLY_API_KEY;
const FASTLY_SERVICE_ID = process.env.FASTLY_SERVICE_ID;
const fastlyPurge = new FastlyPurge(`${process.env.FASTLY_API_KEY}`);
import request from 'request';
import qs from 'qs';
export const OW_COMMUNITY_URL = `http://discussion-gamma.herokuapp.com`;
export const S_IN_YR = 31536000;
export const S_IN_FM = 300;

export const surrogates = {
    genji: ['ow-gengi-hero', 'ow-all-heroes'],
    mccree: ['ow-mccree-hero', 'ow-all-heroes'],
    pharah: ['ow-pharah-hero', 'ow-all-heroes'],
    reaper: ['ow-reaper-hero', 'ow-all-heroes'],
    soldier76: ['ow-soldier76-hero', 'ow-all-heroes'],
    sombra: ['ow-sombra-hero', 'ow-all-heroes'],
    tracer: ['ow-tracer-hero', 'ow-all-heroes'],
    bastion: ['ow-bastion-hero', 'ow-all-heroes'],
    hanzo: ['ow-hanzo-hero', 'ow-all-heroes'],
    junkrat: ['ow-junkrat-hero', 'ow-all-heroes'],
    mei: ['ow-mei-hero', 'ow-all-heroes'],
    torbjorn: ['ow-torbjorn-hero', 'ow-all-heroes'],
    widowmaker: ['ow-widowmaker-hero', 'ow-all-heroes'],
    dva: ['ow-dva-hero', 'ow-all-heroes'],
    reinhardt: ['ow-reinhardt-hero', 'ow-all-heroes'],
    roadhog: ['ow-roadhog-hero', 'ow-all-heroes'],
    winston: ['ow-winston-hero', 'ow-all-heroes'],
    zarya: ['ow-zarya-hero', 'ow-all-heroes'],
    ana: ['ow-ana-hero', 'ow-all-heroes'],
    lucio: ['ow-lucio-hero', 'ow-all-heroes'],
    mercy: ['ow-mercy-hero', 'ow-all-heroes'],
    symmetra: ['ow-symmetra-hero', 'ow-all-heroes'],
    zenyatta: ['ow-zenyatta-hero', 'ow-all-heroes'],
    numbandi: ['ow-numbandi-map', 'ow-all-maps'],
    kingsrow: ['ow-kingsrow-map', 'ow-all-maps'],
    hollywood: ['ow-hollywood-map', 'ow-all-maps'],
    watchpointgibraltar: ['ow-watchpointgibraltar-map', 'ow-all-maps'],
    route66: ['ow-route66-map', 'ow-all-maps'],
    dorado: ['ow-dorado-map', 'ow-all-maps'],
    templeanubis: ['ow-templeanubis-map', 'ow-all-maps'],
    hanamura: ['ow-hanamura-map', 'ow-all-maps'],
    oasis: ['ow-oasis-map', 'ow-all-maps'],
    ilios: ['ow-ilios-map', 'ow-all-maps'],
    lijangtower: ['ow-ligangtower-map', 'ow-all-maps'],
    nepal: ['ow-nepal-map', 'ow-all-maps'],
    eichenwalde: ['ow-eichenwalde-map', 'ow-all-maps'],
    volskayaindustries: ['ow-volskayaindustries-map', 'ow-all-maps']
};

var queue = kue.createQueue({
    prefix: 'OW_QUEUE_',
    redis: {
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
        auth: process.env.REDIS_PASS
    }
});

module.exports = function (app) {
    function handleProxy(originalUrl, url, req, res) {
        var headers = {};
        var r = null;
        let isLoggedIn = false;
        if (typeof req.session.user_id !== 'undefined' && typeof req.session.token !== 'undefined') {
            debug(`session exists`);
            debug(req.session);
            isLoggedIn = true;
            headers['authorization'] = req.session.token;
        } else {
            debug(`session does not exist`);
            debug(req.session)
        }
        try {
            ['accept', 'content-type'].forEach(function (key) {
                if (req.headers[key]) {
                    headers[key] = req.headers[key];
                }
            });
            if (req.method === 'POST') {
                const purgeURL = `${OW_WEB_ROOT}/api${originalUrl}`;
                queue.create('postReq', {url: purgeURL}).save();
                if (headers['content-type'] && headers['content-type'].includes('x-www-form-urlencoded')) {
                    r = request.post({uri: url, headers: headers, form: qs.stringify(req.body)});
                } else {
                    r = request.post({uri: url, headers: headers, json: req.body});
                }
                req.pipe(r, {end: false}).pipe(res);

            } else if (req.method === 'PUT') {
                const purgeURL = `${OW_WEB_ROOT}/api${originalUrl}`;
                if (headers['content-type'] && headers['content-type'].includes('x-www-form-urlencoded')) {
                    r = request.put({uri: url, headers: headers, form: qs.stringify(req.body)});
                } else {
                    r = request.put({uri: url, headers: headers, json: req.body});
                }
                if (originalUrl.split('/')[1] === "tips") {
                  queue.create('instantPutReq', {url: computePurgeKeys(originalUrl)}).save();
                } else {
                  queue.create('putReq', {url: computePurgeKeys(originalUrl)}).save();
                }
                req.pipe(r, {end: false}).pipe(res);

            } else {
                r = request({uri: url, headers: headers});
                req.pipe(r).on('response', function (response) {
                    response.headers['cache-control'] = `max-age=${S_IN_FM}`;
                }).pipe(res);

                //
            }


        } catch (e) {
            console.log(e);
            res.send('We messed up');
        }
    }

    app.use('/api', function (req, res) {
        if (req.method === "GET") {
            res.setHeader('Cache-Control', `max-age=${S_IN_FM}`);
            var t_url = req.url.split("/");
            if (t_url.length < 3) {
                if ("heroes" === t_url[1]) {
                    res.setHeader("Surrogate-Key", 'ow-all-heroes');
                }
                else {
                    res.setHeader("Surrogate-Key", 'ow-all-maps');
                }
            }
            else {
                try {
                    res.setHeader("Surrogate-Key", surrogates[t_url[2].split("?")[0]].join(" "));
                }
                catch (e) {

                }

            }
        }
        var url = OW_API_ROOT + req.url;
        handleProxy(req.url, url, req, res);
    });
    app.use('/communityapi', function (req, res) {
        res.setHeader('Cache-Control', `max-age=${S_IN_FM}`);
        var url = OW_COMMUNITY_URL + req.url;
        handleProxy(url, req, res);
    });

    function computePurgeKeys(url) {
        return surrogates[url.split("/")[2]].join(" ")
    }
};
