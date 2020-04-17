const Elasticsearch = require('elasticsearch');
const assert = require('assert');
let es = null;

const INDEX = 'acfun_test_index';
const TYPE = 'acfun_article_test_type';

describe('es测试', function() {

  before("connect to es server",async()=>{
    es = new Elasticsearch.Client({
      host:'localhost:9200',
      // log:'trace'
    });
  });

  after('clearall data', async function() {
    await es.indices.delete({
        index: INDEX
    })
  });

  const doc = {
    name: 'hjx',
    hobbies: ['game','nodejs'],
    age: 30
  };
  
  it('should create a doc on create function',async function() {
    const created = await es.create({
      index: INDEX,
      type: TYPE,
      id: 1,
      body: doc
    })
  });


  it('should update a doc on update function',async function() {
    doc.age = 18
    const updated = await es.update({
      index: INDEX,
      type: TYPE,
      id: 1,
      body: {
        doc: doc
      }
    });
  });

  it('should update a doc on update function',async function() {
    await es.delete({
      index: INDEX,
      type: TYPE,
      id: 1
    });
  });

  

  it('should create another doc on create function and return the doc just created',async function() {
    const doc2 = {
      name: 'zhangsan',
      hobbies: ['web','java'],
      age: 18
    };
    await es.create({
      index: INDEX,
      type: TYPE,
      id: 2,
      body: doc2
    })
    /*
    为什么在写入后还要加这样一个 等待的任务呢？
    索引是一个 空间换时间的东西
    */
    await new Promise(res=>setTimeout(res,1000));

    const r = await es.search({
      index: INDEX,
      body:{
        query:{
          match:{
            hobbies: doc2.hobbies[0]
          }
        }
      }
    })
    assert.deepEqual(r.hits.hits[0]._source, doc2)
  });

});



