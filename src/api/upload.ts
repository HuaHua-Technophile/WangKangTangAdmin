import { customRequest } from "./instance";

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
