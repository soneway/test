const navData = [
  {
    path: '/0',
    title: '标题0',
  },
  {
    path: '/1',
    title: '标题1',
    children: [
      {
        path: '/1-1',
        title: '标题1-1',
      },
      {
        path: '/1-2',
        title: '标题1-2',
        children: [
          {
            path: '/1-2-1',
            title: '标题1-2-1',
          },
        ],
      },
    ],
  },
  {
    path: '/2',
    title: '标题2',
    children: [
      {
        path: '/2-1',
        title: '标题2-1',
      },
      {
        path: '/2-2',
        title: '标题2-2',
        children: [
          {
            path: '/2-2-1',
            title: '标题2-2-1',
          },
          {
            path: '/2-2-2',
            title: '标题2-2-2',
          },
        ],
      },
      {
        path: '/2-3',
        title: '标题2-3',
      },
    ],
  },
];
const path = '/2-2-2';

function getCurrentPath(navData = [], path = '', res = []) {
  for (const item of navData) {
    const { children = [], ...rest } = item;
    res.push(rest);

    // 找到
    if (item.path === path) {
      return res;
    }

    if (children.length) {
      const found = getCurrentPath(children, path, res);
      if (found) {
        return found;
      }
    }

    res.pop();
  }
}

console.log(getCurrentPath(navData, path));
// 期望返回
const res = [
  {
    path: '/2',
    title: '标题2',
  },
  {
    path: '/2-2',
    title: '标题2-2',
  },
  {
    path: '/2-2-3',
    title: '标题2-2-3',
  },
];
