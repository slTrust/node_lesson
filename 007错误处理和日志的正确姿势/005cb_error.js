function foo(param, cb){
  const error = new Error('something wrong async')
  if(error) cb(error)
}

foo({},(err,result)=>{
    if(err){
        console.log(err)
    }
})


async function foo2(){
  throw new Error('async function wrong')
}

foo2()
  .catch(e=>{
      console.log(e)
  })

// async函数内部处理异常
async function foo3(){
  try {
    await bar();
  }catch(e){
    console.log(e)
  }
}

async function bar(){
  throw new Error('async function wrong2')
}

foo3()


// 分阶段处理
async function foo4(){
  await bar().catch(e=>{
      console.log('bar catch err')
      throw e;
  });
}
  
  async function bar(){
    throw new Error('async function wrong2')
  }
  
  foo4()
    .catch(e=>{
        console.log('foo4 catch err')
    })
  