## score

> 比如添加两条记录

```
put  http://localhost:9200/user/man/laoyang
body内容
{
	"name":"laoyang",
	"age":18,
	"desc":"老杨今天中午吃了米粉"
}

put  http://localhost:9200/user/man/xiaozhang
body内容
{
	"name":"xiaozhang",
	"age":18,
	"desc":"老杨是个好人"
}
```

- post http://localhost:9200/user/man/_search
body里输入如下内容

```
{
	"query":{
		"match":{
			"desc":"老杨"
		}
	}
}
```

此时出现一个算分

```
{
	"took": 9,
	"timed_out": false,
	"_shards": {
		"total": 5,
		"successful": 5,
		"failed": 0
	},
	"hits": {
		"total": 2,
		"max_score": 0.38200712,
		"hits": [
			{
				"_index": "user",
				"_type": "man",
				"_id": "xiaozhang",
				"_score": 0.38200712,
				"_source": {
					"name": "xiaozhang",
					"age": 18,
					"desc": "老杨是个好人"
				}
			},
			{
				"_index": "user",
				"_type": "man",
				"_id": "laoyang",
				"_score": 0.32716757,
				"_source": {
					"name": "laoyang",
					"age": 18,
					"desc": "老杨今天中午吃了米粉"
				}
			}
		]
	}
}
```

如果此时修改记录

```
put  http://localhost:9200/user/man/xiaozhang
body内容
{
	"name":"xiaozhang",
	"age":18,
	"desc":"老杨是个人"
}

put  http://localhost:9200/user/man/laoyang
body内容
{
	"name":"laoyang",
	"age":18,
	"desc":"老杨今天中午在食堂吃了番茄鱼丸米粉"
}
```

再次对同样的条件进行搜索：你会发现分数变了

```
{
	"took": 4,
	"timed_out": false,
	"_shards": {
		"total": 5,
		"successful": 5,
		"failed": 0
	},
	"hits": {
		"total": 2,
		"max_score": 0.46439034,
		"hits": [
			{
				"_index": "user",
				"_type": "man",
				"_id": "xiaozhang",
				"_score": 0.46439034,
				"_source": {
					"name": "xiaozhang",
					"age": 18,
					"desc": "老杨是个人"
				}
			},
			{
				"_index": "user",
				"_type": "man",
				"_id": "laoyang",
				"_score": 0.26653138,
				"_source": {
					"name": "laoyang",
					"age": 18,
					"desc": "老杨今天中午在食堂吃了番茄鱼丸米粉"
				}
			}
		]
	}
}
```

从结果上看,句子越长对应的分值越低。(包含的信息在整句信息量的比例)

```
老杨是个好人 => 老杨是好人 
0.38200712 => 0.46439034

老杨今天中午吃了米粉 => 老杨今天中午在食堂吃了番茄鱼丸米粉
0.32716757        =>  0.26653138
```

### score的影响因素

- 与 “老杨” 无关信息越多，那么 “老杨”在整个 句子的信息比 就少一点
- 不同词性对分数的算分影响不同
    - 有的时候 内容不一样 但是分数一样 “老杨是个好人”，“老杨是个好的人”
    - 有的时候  “老杨是杨光”，“老杨是好人”  头一句的分数更高

#### 控制相关度

- https://www.elastic.co/guide/cn/elasticsearch/guide/current/controlling-relevance.html

