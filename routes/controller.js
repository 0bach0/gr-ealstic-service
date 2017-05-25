var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: process.env.ELASTIC_FULLURL
});
var CONVERT_DATA ={'0':'Tin tức khác','1':'Học phí','2':'Học bổng','3':'Tuyển sinh','4':'Tuyển dụng','5':'Đào tạo','6':'Quy chế','7':'Sinh viên'}

client.ping({
  requestTimeout: 30000,
}, function (error) {
  if (error) {
    console.error('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});

exports.getlastestpost=(req,res,next)=>{
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
        size:100,
        sort:"created_time"
      }
    }).then(function (body) {
        var hits = body.hits.hits;
        var responseData =[];
        for(var x in hits){
          var tmpData = {};
          tmpData.id = hits[x]._source.id;
          tmpData.from = hits[x]._source.from_name;
          tmpData.created_time = hits[x]._source.created_time;
          tmpData.type = hits[x]._source.type;
          tmpData.type_text = hits[x]._source.type_text;
          tmpData.message = hits[x]._source.message;
          responseData.push(tmpData);
        }
        res.send({status:"done",message:responseData});
    }, function (error) {
        res.status(400).send({status:"error"});
        console.trace(error.message);
    });    
}

exports.getpostbypage=(req,res,next)=>{
    console.log(req.body);
    var checked = (!req.body.id || !req.body.from) ? false : true;
    if(checked) {
        client.search({
            from:req.body.from, //Pagination support
            size:500,
            index: 'facebook',
            type: 'fb_map',
            body: {
            query: {
                match: {
                    from_id: req.body.id
                }
            },
            sort:{ "created_time": { order: "desc" }}
          }
        }).then(function (body) {
            var hits = body.hits.hits;
            var responseData =[];
            for(var x in hits){
              var tmpData = {};
              console.log(hits[x]);
              tmpData._id = hits[x]._id;
              tmpData.id = hits[x]._source.id;
              tmpData.from = hits[x]._source.from_name;
              tmpData.created_time = hits[x]._source.created_time;
              tmpData.type = hits[x]._source.type;
              tmpData.type_text = hits[x]._source.type_text;
              tmpData.message = hits[x]._source.message
              responseData.push(tmpData);
            }
            console.log(hits.length);
            res.send({status:"done",message:responseData});
        }, function (error) {
            res.status(400).send({status:"error"});
            console.trace(error.message);
        });    
    }
    else{
         res.send({status:'error',message:{info:'Required parameters.'}});
    }

}

exports.editposttype=(req,res,next)=>{
    console.log(req.body);
    var checked = (!req.body._id || !req.body.type) ? false : true;
    if(checked) {
        
        // client.updateByQuery({
        //     index: 'facebook',
        //     type: 'fb_map',
        //     id: '',
        //     body: {
        //     script: 'ctx._source.counter += 1',
        //     upsert: {
        //       counter: 1
        //     }
        //     }
        // }).then(function (body) {
            
        //     console.log(body);
        //     res.send({status:"done"});
        // }, function (error) {
        //     res.status(400).send({status:"error"});
        //     console.trace(error.message);
        // });
        
        client.update({
          index: 'facebook',
          type: 'fb_map',
          id: req.body._id,
          body: {
            // put the partial document under the `doc` key
            doc: {
              type: req.body.type,
              type_text:CONVERT_DATA[req.body.type]
            }
          }
        }, function (error, response) {
          if(error){
              console.log(error,response);
              res.send({status:'error'});
          }
          else{
              res.send({status:'done'});
          }
        })
    }
    else{
         res.send({status:'error',message:{info:'Required parameters.'}});
    }

    
    
}