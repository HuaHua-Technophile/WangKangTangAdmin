/**
 * @fileoverview 封装了一个基于 Element Plus 的消息确认框工具函数，提供统一的确认操作体验。
 * @module utils/elMessageBoxConfirm
 */

import { ElMessage, ElMessageBox } from "element-plus";

/**
 * 显示一个带确认和取消按钮的消息确认框。
 *
 * @function elMessageBoxConfirm
 * @param {string} title - 确认框的标题，用于提示用户当前操作的内容。
 * @param {() => void} callback - 当用户点击“确认”按钮时执行的回调函数。
 * @returns {void}
 *
 * @example
 * elMessageBoxConfirm("删除数据", () => {
 *   console.log("用户确认删除操作");
 * });
 */
export const elMessageBoxConfirm = (
  title: string,
  callback: () => void
): void => {
  ElMessageBox.confirm(`确认 ${title} 吗?`, {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
    customClass: "rounded",
  })
    .then(() => {
      // 用户点击确认按钮时执行回调，并显示信息提示
      callback();
      ElMessage.info(title);
    })
    .catch(() => {
      // 用户点击取消按钮时显示取消信息提示
      ElMessage.info(`取消操作:${title}`);
    });
};
