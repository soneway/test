import data from './data.js';

function dealSfData(array = [], res = []) {
  for (const item of array) {
    if (item.permissionCode.includes('SF') || item.permissionCode.includes('SHUNFENG')) {
      const resItem = {
        permissionCode: item.permissionCode,
        resourcesName: item.resourcesName,
        url: item.url,
      };

      res.push(resItem);

      const { childList = [] } = item;
      if (childList.length) {
        dealSfData(childList, resItem.childList = []);
      }
    }
  }

  return res;
}

console.log(data, dealSfData(data));
