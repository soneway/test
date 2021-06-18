function* generator() {
  let i = 1;
  console.log('i', i);
  const a = yield i++; // => return i++; const a = arg; // arg为g.next(arg)的参数
  console.log('a', a);
  const b = yield 10;
  console.log('b', b);
}

const g = generator();
g.next();
g.next(999);
