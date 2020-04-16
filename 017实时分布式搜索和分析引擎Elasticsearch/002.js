const elasticsearch = require('elasticsearch');
const es = new elasticsearch.Client({
    host:'localhost:9200',
    log:'trace'
});

(async ()=> {
  const created = await es.create({
      index:'whatever',
      type:'ever',
      id:'laoyang',
      body:{
          name:'laoyang',
          hobbies:['game','web','nodejs']
      }
  })

  console.log(created)

  const updated = await es.update({
    index:'whatever',
    type:'ever',
    id:'laoyang',
    body:{
      doc:{
        age:30,
      }
    }
  })

  console.log(updated)

  const result = await es.search({
    index:'whatever',
    body:{
      query:{
        match:{
          hobbies:'game'
        }
      }
    }
  })
  console.log(result)

  const deleted = await es.delete({
    index:'whatever',
    type:'ever',
    id:'laoyang',
  })

})()
  .then(r=>{
    process.exit(0)
  })
  .catch(e=>{
    console.log(e)
    process.exit(1);
  })