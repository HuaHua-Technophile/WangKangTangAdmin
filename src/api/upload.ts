/**
 * @fileoverview 提供一个通用文件上传功能，支持通过自定义键名上传文件。
 * 本文件依赖于自定义的 `customRequest` 方法实现 HTTP 请求。
 * 请确保在使用该模块前，已经正确配置了 `customRequest` 方法。
 */

import { customRequest } from "./instance";

/**
 * 通用文件上传方法
 * @param {File} file - 要上传的文件对象
 * @param {string} [fileKey="file"] - 文件对应的表单字段名称，默认为 "file"
 *
 * @example
 * import { allFileUpload } from "./fileUploader";
 *
 * const fileInput = document.querySelector('input[type="file"]');
 * if (fileInput?.files?.[0]) {
 *   allFileUpload(fileInput.files[0], "customKey")
 *     .then(response => {
 *       console.log("上传成功:", response);
 *     })
 *     .catch(error => {
 *       console.error("上传失败:", error);
 *     });
 * }
 */
export const allFileUpload = (file: File, fileKey: string = "file") => {
  const formData = new FormData();
  formData.append(fileKey, file);

  return customRequest(
    {
      url: "/common/upload",
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
    "通用文件上传"
  );
};
