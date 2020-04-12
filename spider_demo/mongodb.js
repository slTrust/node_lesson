var MongoClient = require('mongodb').MongoClient;

(async ()=>{
    var client = await MongoClient.connect('mongodb://localhost:27017',{useNewUrlParser: true, useUnifiedTopology: true});
    var db = client.db('acfun');
    // db.collection('customers').findOne({}, function (findErr, result) {
    //     if (findErr) throw findErr;
    //     console.log(result);
    //     client.close();
    // });

    db.collection('customers')
    .findOneAndUpdate({
      acfunid:111
    },
    {$set:{
        acfunid: 111,
        content: 'aaaa',
        articleContentHtml: 'bbb',
        createAt: Date.now().valueOf()
    }}
   ,
    {
      upsert: true
    },function(err,doc){
        if (err) { throw err; }
        else { console.log("Updated"); }
    });
    // return res
  })()
  .then(r=>{
    console.log(r)
  })
  .catch(e=>{
    console.log(e)
  });

/*
db.collection问题参考

https://stackoverflow.com/questions/47662220/db-collection-is-not-a-function-when-using-mongoclient-v3-0
*/