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
export const validateAlphaNumericUnderscore = (
  _rule: any,
  value: string,
  callback: (arg0?: Error) => void
) => {
  const regex = /^[a-zA-Z][a-zA-Z0-9_]*$/; // 必须以英文字符开头，后面可以跟英文、数字和下划线
  if (value === "") callback(); // 允许空字符串通过
  else if (!regex.test(value))
    callback(new Error("必须以英文字符开头，仅允许英文、数字和下划线"));
  else callback();
};

export const validateLowerCaseAlphaNumericUnderscore = (
  _rule: any,
  value: string,
  callback: (arg0?: Error) => void
) => {
  const regex = /^[a-z][a-z0-9_]*$/; // 必须以小写英文字符开头，后面可以跟小写英文、数字和下划线
  if (value === "") callback(); // 允许空字符串通过
  else if (!regex.test(value))
    callback(new Error("必须以小写英文字符开头，仅允许小写英文、数字和下划线"));
  else callback();
};
export const validateLowerCaseAlphaNumericDot = (
  _rule: any,
  value: string,
  callback: (arg0?: Error) => void
) => {
  const regex = /^[a-z][a-z0-9.]*$/; // 必须以小写英文字符开头，后面可以跟小写英文、数字和点符号
  if (value === "") callback(); // 允许空字符串通过
  else if (!regex.test(value))
    callback(new Error("必须以小写英文字符开头，仅允许小写英文、点符号和数字"));
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

export const userNameRule = [
  { required: true, message: "请输入用户名", trigger: "blur" },
  { min: 3, max: 15, message: "用户名长度在3~15个字符", trigger: "blur" },
  {
    validator: validateAlphaNumericUnderscore,
    trigger: "blur",
  },
];
