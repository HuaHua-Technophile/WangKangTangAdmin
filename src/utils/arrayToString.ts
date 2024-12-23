export const encodeArray = (arr: string[]): string => {
  // 使用 Array.join 代替 map+join，减少一次数组遍历
  return arr.reduce((acc, item) => {
    const escaped = item.replace(/[『』]/g, (match) => match + match);
    return acc + `『${escaped}』`;
  }, "");
};

export const decodeArray = (str: string): string[] => {
  // 使用正则表达式简化解析逻辑
  const regex = /『((?:[^『』]|『『|』』)*?)』/g;
  const result: string[] = [];
  let match;

  while ((match = regex.exec(str)) !== null) {
    // 还原转义字符
    result.push(match[1].replace(/(『『|』』)/g, (match) => match[0]));
  }

  return result;
};
