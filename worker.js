var kue = require('kue');
var FastlyPurge = require('fastly-purge');
var FASTLY_API_KEY = process.env.FASTLY_API_KEY;
var FASTLY_SERVICE_ID = process.env.FASTLY_SERVICE_ID;
var fastlyPurge = new FastlyPurge(`${process.env.FASTLY_API_KEY}`);
var util = require('util');

var queue = kue.createQueue({
    prefix: 'OW_QUEUE_',
    redis: {
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
        auth: process.env.REDIS_PASS
    }
});

var putKeys = {};
var allHeroCount = 0;
var allMapCount = 0;

queue.process('instantPutReq', function(job, done) {
  var keys = job.data.url.split(" ");
  fastlyPurge.key(FASTLY_SERVICE_ID, keys[0], function (err, result) {
    console.log("purged: " + keys[0]);
  })
})

queue.process('putReq', function (job, done) {
    console.log("processing put job");
    console.log(job.data);
    var keys = job.data.url.split(" ");
    if (keys.length > 1) {
        if (keys[0] in putKeys) {
            if (putKeys[keys[0]] > 10) {
                fastlyPurge.key(FASTLY_SERVICE_ID, keys[0], function (err, result) {
                    putKeys[keys[0]] = 0;
                })
            }
            else {
                putKeys[keys[0]] += 1;
            }
        }
        else {
            putKeys[keys[0]] = 1;
        }
        if(keys[1].indexOf("heroes") > -1) {
            allHeroCount += 1;
        }
        if (keys[1].indexOf("maps") > -1) {
            allMapCount += 1;
        }
    }
    else {
        if (keys[0].indexOf("heroes") > -1) {
            allHeroCount += 1;
        }
        else if (keys[0].indexOf("maps") > -1) {
            allMapCount += 1;
        }
    }
    if(allHeroCount > 40) {
        allHeroCount = 0;
        fastlyPurge.key(FASTLY_SERVICE_ID, "ow-all-heroes", function (err, result) {
        })
    }
    if(allMapCount > 40) {
        allMapCount = 0;
        fastlyPurge.key(FASTLY_SERVICE_ID, "ow-all-maps", function (err, result) {
        })
    }


    console.log(`Put urls: ${util.inspect(putKeys, false, null)}`);
    done();
});

queue.process('postReq', function (job, done) {
    console.log("processing post job")
    fastlyPurge.url(job.data.url, function (err, result) {
        console.log(err);
        done();
    })
});
