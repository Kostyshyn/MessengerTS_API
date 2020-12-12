export const truncate = (
  fullStr: string,
  strLen: number,
  separator?: string
): string => {
  if (fullStr.length <= strLen) {
    return fullStr;
  }
  separator = separator || '...';
  const sepLen = separator.length;
  const charsToShow = strLen - sepLen;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);

  return (
    fullStr.substr(0, frontChars) +
    separator +
    fullStr.substr(fullStr.length - backChars)
  );
};

export const getCleanUrl = (
  url: string,
  partsToDelete = [],
  partsToReplace = {}
): string => {
  let result = url;
  const regexpDelete = new RegExp(partsToDelete.join('|'),'gi');
  result = result.replace(regexpDelete, '');
  if (Object.keys(partsToReplace).length) {
    const regexpReplace = new RegExp(Object.values(partsToReplace).join('|'),'gi');
    result = result.replace(
      regexpReplace,
      (matched) => {
        const replaceTo = Object.keys(partsToReplace).find(key => partsToReplace[key] === matched);
        return `{${replaceTo}}`;
      });
  }
  return result;
};
