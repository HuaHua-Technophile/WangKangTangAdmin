/**
 * @fileoverview 提供验证码生成相关的工具函数
 */

/**
 * 生成指定长度的随机验证码
 * @param {number} [length=6] - 验证码长度，默认为6位
 * @returns {string} 生成的验证码字符串
 * @example
 * // 生成默认6位验证码
 * generateCode() // 返回类似 "A2B8X9"
 *
 * // 生成4位验证码
 * generateCode(4) // 返回类似 "12AB"
 */
export const generateCode = (length = 6) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};
