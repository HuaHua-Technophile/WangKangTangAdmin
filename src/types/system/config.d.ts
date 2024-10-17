// @/types/system/config.ts
export interface ConfigItem {
  configId: number;
  configName: string;
  configKey: string;
  configValue: string;
  configType: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
  remark?: string;
}

export type ConfigParams = PaginationParams &
  Pick<ConfigItem, "configName" | "configKey" | "configType">;
