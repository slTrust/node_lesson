process.on('uncaughtException', (p1, p2) => {
  console.log(p1);
  console.log(p2);
});

process.on('unhandledRejection', (reason, p) => {
  console.log(reason)
  console.log(p)
//   process.exit(1); // 结束进程
})

throw new Error('catch me!!!');
