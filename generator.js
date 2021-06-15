function* generator() {
  const r1 = yield new Promise((resolve) => {
    setTimeout(() => {
      resolve(100);
    }, 1000);
  });
  console.log('r1', r1); // 1000ms之后打印100

  const r2 = yield new Promise((resolve) => {
    setTimeout(() => {
      resolve(200);
    }, 2000);
  });
  console.log('r2', r2); // 2000ms之后打印200

  const r3 = yield new Promise((resolve) => {
    setTimeout(() => {
      resolve(300);
    }, 3000);
  });
  console.log('r3', r3); // 3000ms之后打印300

  return 400;
}

// 完成run函数
function run(generator) {
  return new Promise((resolve, reject) => {
    const g = generator();

    function next(value) {
      // 获取下个yield, 并传递上个yield表达式的值
      const res = g.next(value);
      // console.log('res', res);

      // 生成器结束
      if (res.done) {
        return resolve(res.value);
      }

      // 生成器未结束
      // resolve yield表达式
      Promise.resolve(res.value)
        .then((value) => {
          // 继续运行生成器, 并把当前resolve的值传过去
          next(value);
        })
        .catch(reject);
    }

    next();
  });
}

run(generator)
  .then((res) => {
    console.log('then', res); // 400
  })
  .catch((e) => {
    console.log('catch', e); // 运行过程中异常可捕获
  });
