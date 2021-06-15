function* generator() {
  const r1 = yield new Promise((resolve) => {
    setTimeout(() => {
      resolve(100);
    }, 1000);
  });
  console.log(r1);

  const r2 = yield new Promise((resolve) => {
    setTimeout(() => {
      resolve(200);
    }, 2000);
  });
  console.log(r2);

  const r3 = yield new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(300);
    }, 3000);
  });
  console.log(r3);
}

function run(gen) {
  const g = gen();

  function step(value) {
    const res = g.next(value);

    if (res.done) {
      return res.value;
    }

    Promise.resolve(res.value).then((value) => {
      // console.log(111111, value);
      step();
    });
  }

  step();
}

run(generator);
