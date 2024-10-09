export const validateNoChineseOrSpaces = (
  _rule: any,
  value: string,
  callback: (arg0?: Error) => void
) => {
  const regex = /^[^\u4E00-\u9FFF\s]*$/; // 不能有中文和空格的正则表达式
  if (value === "") callback(); // 允许空字符串通过
  else if (!regex.test(value)) callback(new Error("不能包含中文和空格"));
  else callback();
};
