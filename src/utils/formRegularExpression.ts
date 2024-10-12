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

export const passwordRule = [
  { required: true, message: "请输入密码", trigger: "blur" },
  { min: 6, max: 20, message: "密码长度为6~20个字符", trigger: "blur" },
  {
    validator: validateNoChineseOrSpaces,
    trigger: "blur",
  },
];
