const elasticsearch = require('elasticsearch');
const es = new elasticsearch.Client({
    host:'localhost:9200',
    log:'trace'
});

(async ()=> {
  const result = await es.search({
    index:'user',
    body:{
      query:{
        match:{
          desc:"老杨"
        }
      }
    }
  })
  console.log(result)
})()
  .then(r=>{
    process.exit(0)
  })
  .catch(e=>{
    console.log(e)
    process.exit(1);
  })