/**
 * @fileoverview 系统参数设置相关的API请求函数
 * @module @/api/system/config
 * @description 包含参数设置的增删改查等接口
 */

import { customRequest } from "@/api/instance";
import { ConfigItem, ConfigParams } from "@/types/system/config";

/**
 * 查询参数设置列表
 * @async
 * @function getConfigList
 * @param {ConfigParams} params - 查询参数对象
 * @param {string} [params.configName] - 参数名称
 * @param {string} [params.configKey] - 参数键名
 * @param {string} [params.configType] - 参数类型
 * @returns {Promise<ConfigItem[]>} 返回参数设置列表
 * @throws {Error} 请求失败时抛出错误
 */
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

/**
 * 批量删除参数设置
 * @async
 * @function delConfigs
 * @param {number[]} configIds - 要删除的参数ID数组
 * @returns {Promise<any>} 删除操作的结果
 * @throws {Error} 请求失败时抛出错误
 * @example
 * // 删除多个配置项
 * await delConfigs([1, 2, 3])
 */
export const delConfigs = (configIds: number[]) => {
  return customRequest(
    {
      method: "DELETE",
      url: `/system/config/${configIds}`,
    },
    `删除参数设置`
  );
};

/**
 * 新增参数设置
 * @async
 * @function addConfig
 * @param {Omit<ConfigItem, "configId">} data - 新增的参数设置数据（不包含configId）
 * @returns {Promise<any>} 新增操作的结果
 * @throws {Error} 请求失败时抛出错误
 * @example
 * // 新增配置项
 * await addConfig({
 *   configName: "系统主题",
 *   configKey: "sys.theme",
 *   configValue: "dark",
 *   configType: "string"
 * })
 */
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

/**
 * 修改参数设置
 * @async
 * @function editConfig
 * @param {ConfigItem} data - 要修改的参数设置完整数据
 * @returns {Promise<any>} 修改操作的结果
 * @throws {Error} 请求失败时抛出错误
 * @example
 * // 修改配置项
 * await editConfig({
 *   configId: 1,
 *   configName: "系统主题",
 *   configValue: "light"
 * })
 */
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

/**
 * 根据参数键名获取参数值
 * @async
 * @function getConfigValueByConfigKey
 * @param {string} configKey - 参数键名
 * @returns {Promise<any>} 返回的数据在response的msg字段中
 * @throws {Error} 请求失败时抛出错误
 * @example
 * // 获取系统主题配置
 * const response = await getConfigValueByConfigKey("sys.theme")
 * const themeValue = response.msg
 */
export const getConfigValueByConfigKey = (configKey: string) => {
  return customRequest(
    {
      method: "GET",
      url: `/system/config/configKey/${configKey}`,
    },
    `获取${configKey}参数的值`
  );
};
