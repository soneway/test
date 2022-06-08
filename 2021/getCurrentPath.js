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

// function getCurrentPath(navData, path) {
//   const res = [];
//
//   function recursePath(arrayData = [], path = '') {
//     for (const item of arrayData) {
//       const { children = [], ...rest } = item;
//       res.push(rest);
//
//       // 找到
//       if (item.path === path) {
//         return res;
//       }
//
//       if (children.length) {
//         const found = recursePath(children, path);
//         if (found) {
//           return found;
//         }
//       }
//
//       res.pop();
//     }
//   }
//   recursePath(navData, path);
//
//   return res;
// }

function getCurrentPath(navData, path) {
  let res;

  function recursePath(arrayData = [], path = '', sup = []) {
    for (const item of arrayData) {
      const { children = [], ...rest } = item;
      if (item.path === path) {
        res = [...sup, rest];
        return res;
      }

      if (children.length) {
        const found = recursePath(children, path, [...sup, rest]);
        if (found) {
          return found;
        }
      }
    }
  }
  recursePath(navData, path);

  return res;
}

console.log(getCurrentPath(navData, '/2-2-2'));
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
