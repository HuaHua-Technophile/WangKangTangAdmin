/**
 * @fileoverview 提供用于编码和解码数组的工具函数。
 * encodeArray 函数用于将字符串数组编码为特定格式的字符串。
 * decodeArray 函数则用于将编码后的字符串解析回字符串数组。
 *
 * 本文件中的实现注重性能优化，避免不必要的数组遍历，并通过正则表达式简化解析逻辑。
 */

/**
 * 将字符串数组编码为特定格式的字符串。
 * 每个字符串会被包裹在特殊符号『』中，并对符号『』进行转义。
 *
 * @param {string[]} arr - 需要编码的字符串数组。
 * @returns {string} 编码后的字符串。
 *
 * @example
 * const encoded = encodeArray(["hello", "world"]);
 * console.log(encoded); // 输出: "『hello』『world』"
 */
export const encodeArray = (arr: string[]): string => {
  // 使用 Array.join 代替 map+join，减少一次数组遍历
  return arr.reduce((acc, item) => {
    const escaped = item.replace(/[『』]/g, (match) => match + match);
    return acc + `『${escaped}』`;
  }, "");
};

/**
 * 将编码后的字符串解析回字符串数组。
 * 解析时会自动处理转义符号『』，还原原始字符串。
 *
 * @param {string} str - 需要解码的字符串。
 * @returns {string[]} 解码后的字符串数组。
 *
 * @example
 * const decoded = decodeArray("『hello』『world』");
 * console.log(decoded); // 输出: ["hello", "world"]
 */
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
