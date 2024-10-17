import { customRequest } from "@/api/instance";
import { ConfigItem, ConfigParams } from "@/types/system/config";

// 1. 查询参数设置列表
export const getConfigList = (params: ConfigParams) => {
  return customRequest<ConfigItem[]>(
    {
      method: "GET",
      url: "/system/config/list",
      params,
    },
    "获取参数设置列表"
  );
};

// 2. 删除参数设置
export const delConfigs = (params: number[]) => {
  return customRequest(
    {
      method: "DELETE",
      url: `/system/config/${params}`,
    },
    `删除参数设置`
  );
};

// 3. 新增参数设置
export const addConfig = (data: Omit<ConfigItem, "configId">) => {
  return customRequest(
    {
      method: "POST",
      url: "/system/config",
      data,
    },
    "新增参数设置"
  );
};

// 4. 修改参数设置
export const editConfig = (data: ConfigItem) => {
  return customRequest(
    {
      method: "PUT",
      url: "/system/config",
      data,
    },
    "修改参数设置"
  );
};

// 5. 根据参数键名获取参数值,数据回传在msg中
export const getConfigValueByConfigKey = (configKey: string) => {
  return customRequest(
    {
      method: "GET",
      url: `/system/config/configKey/${configKey}`,
    },
    `获取${configKey}参数的值`
  );
};
