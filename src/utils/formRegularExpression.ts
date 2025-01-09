/**
 * @fileoverview 表单验证规则集合，包含密码、用户名等输入验证函数和规则
 * @author Your Name
 * @copyright 2024
 */

/**
 * 验证输入是否不包含中文字符和空格
 * @param {any} _rule - 验证规则对象（未使用）
 * @param {string} value - 待验证的字符串
 * @param {Function} callback - 回调函数，用于返回验证结果
 * @returns {void}
 */
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

/**
 * 验证输入是否符合以英文字母开头，后跟英文字母、数字或下划线的格式
 * @param {any} _rule - 验证规则对象（未使用）
 * @param {string} value - 待验证的字符串
 * @param {Function} callback - 回调函数，用于返回验证结果
 * @returns {void}
 */
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

/**
 * 验证输入是否符合以小写英文字母开头，后跟小写字母、数字或下划线的格式
 * @param {any} _rule - 验证规则对象（未使用）
 * @param {string} value - 待验证的字符串
 * @param {Function} callback - 回调函数，用于返回验证结果
 * @returns {void}
 */
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

/**
 * 验证输入是否符合以小写英文字母开头，后跟小写字母、数字或点号的格式
 * @param {any} _rule - 验证规则对象（未使用）
 * @param {string} value - 待验证的字符串
 * @param {Function} callback - 回调函数，用于返回验证结果
 * @returns {void}
 */
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

/**
 * 密码验证规则集合
 * @type {Array<Object>}
 */
export const passwordRule = [
  { required: true, message: "请输入密码", trigger: "blur" },
  { min: 6, max: 20, message: "密码长度为6~20个字符", trigger: "blur" },
  {
    validator: validateNoChineseOrSpaces,
    trigger: "blur",
  },
];

/**
 * 用户名验证规则集合
 * @type {Array<Object>}
 */
export const userNameRule = [
  { required: true, message: "请输入账号", trigger: "blur" },
  { min: 3, max: 15, message: "账号长度在3~15个字符", trigger: "blur" },
  {
    validator: validateAlphaNumericUnderscore,
    trigger: "blur",
  },
];
