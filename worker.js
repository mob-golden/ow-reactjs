var kue = require('kue');
var FastlyPurge = require('fastly-purge');
var FASTLY_API_KEY = process.env.FASTLY_API_KEY;
var FASTLY_SERVICE_ID = process.env.FASTLY_SERVICE_ID;
var fastlyPurge = new FastlyPurge(`${process.env.FASTLY_API_KEY}`);

var queue = kue.createQueue({
    prefix: 'OW_QUEUE_',
    redis: {
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
        auth: process.env.REDIS_PASS
    }
});

var putUrls = {}

queue.process('putReq', function(job,done) {
  if(job.url in putUrls) {
    if(putUrls[job.url] > 10) {
      fastlyPurge.url(job.url, function(err, result){
        putUrls[job.url] = 0;
      })
    }
    else {
      putUrls[job.url] += 1;
    }
  }
  else {
    putUrls[job.url] = 1;
  }
  done();
});

queue.process('postReq', function(job, done) {
  fastlyPurge.url(job.url, function(err, result){
    console.log(err);
    done();
  })
});
