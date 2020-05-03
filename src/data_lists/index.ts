export const showFields = (data, dataList: string[]): any => {
  const result = {};
  if (data && dataList && dataList.length) {
    for (const index in dataList) {
      if (data[dataList[index]] === false || data[dataList[index]]) {
        result[dataList[index]] = data[dataList[index]];
      }
    }
  }
  return result;
};