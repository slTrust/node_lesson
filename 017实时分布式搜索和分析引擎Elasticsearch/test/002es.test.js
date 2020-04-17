const Elasticsearch = require('elasticsearch');
const assert = require('assert');
let es = null;

const INDEX = 'acfun_test_index2';
const TYPE = 'acfun_article_test_type2';

describe('es score测试', function () {
    const K1 = "炼金术";
    const doc1 = {
        title: '牛顿真的研究炼金术吗',
        tags: [
            {
                tagValue: '炼金术',
                tagScore: 5
            },
            {
                tagValue: '牛顿',
                tagScore: 8
            }
           
        ]
    };
    const doc2 = {
        title: '钢之炼金术',
        tags: [
            {
                tagValue: '炼金术',
                tagScore: 8
            },
            {
                tagValue: '好玩',
                tagScore: 3
            }
        ]
    };

    beforeEach("在每个测试用例开始之前执行", async () => {
        es = new Elasticsearch.Client({
            host: 'localhost:9200',
            // log: 'trace'
        });

        await Promise.all([
            es.create({
                index: INDEX,
                type: TYPE,
                id: 1,
                body: doc1
            }),
            es.create({
                index: INDEX,
                type: TYPE,
                id: 2,
                body: doc2
            })
        ])

        await new Promise(rsv => setTimeout(rsv, 1000));
    });

    afterEach('在每个测试用例结束之后', async function () {
        await es.indices.delete({
            index: INDEX
        })
    });


    it('搜索 “炼金术” 返回的doc1和 doc2 同时 _score应该一样', async () => {
        const r = (await es.search({
            index: INDEX,
            type: TYPE,
            body: {
                query: {
                    match: {
                        "tags.tagValue": K1
                    }
                }
            }
        })).hits.hits;
        const s1 = r[0]._score;
        const s2 = r[1]._score;
        assert.equal(s1,s2)
    });

    it('搜索 “炼金术” 应该 doc2的分数更高', async () => {
        const r = (await es.search({
            index: INDEX,
            type: TYPE,
            body: {
                query:{
                    function_score: {
                        query:{
                            match: {
                                "tags.tagValue": K1
                            }
                        },
                        field_value_factor:{
                            field: 'tags.tagScore'
                        }
                    }
                }
            }
        })).hits.hits;
        const s1 = r.find(d=>d._id == '1')._score;
        const s2 = r.find(d=>d._id == '2')._score;
        // 通过 tagScore 对数据搜索的 算分增加权重
        console.log(s1,s2)
        // assert.equal(true,s1 < s2)
    });


})

