// ELASTIC_FULLURL=https://elastic:14WzKb0e8tvH4p0hILOChY7c@88edb1a54087bdcdfc59f8e8dabae46c.ap-southeast-1.aws.found.io:9243
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: process.env.ELASTIC_FULLURL
});

client.ping({
  requestTimeout: 30000,
}, function (error) {
  if (error) {
    console.error('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});


client.search({
  index: 'facebook',
  type: 'fb_map',
  body: {
    query: {
        range : {
            created_time : {
                gte : "now-1w",
                lte :  "now"
            }
        }
    },
    size:100
  }

}).then(function (body) {
  var hits = body.hits.hits;
  console.log(hits.length);
}, function (error) {
  console.trace(error.message);
});