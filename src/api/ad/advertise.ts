import { AxiosRequestConfig } from "axios";
import { customRequest } from "@/api/instance";
import { AdvertiseItem, GetAdvertiseItemParams } from "@/types/ad/advertise";

/**
 * 添加广告
 * @param data 广告数据
 * @returns Promise<AxiosResponse<AdvertiseItem>>
 */
export const addAdvertise = (data: Omit<AdvertiseItem, "id">) => {
  const config: AxiosRequestConfig = {
    url: "/home/advertise/add",
    method: "POST",
    data,
  };
  return customRequest(config, "添加轮播广告");
};

/**
 * 删除广告
 * @param ids 需要删除的广告ID数组
 * @returns Promise<AxiosResponse<void>>
 */
export const delAdvertise = (ids: bigint[]) => {
  const config: AxiosRequestConfig = {
    url: `/home/advertise/delete/${ids.join(",")}`,
    method: "DELETE",
  };
  return customRequest(config, "删除轮播广告");
};

/**
 * 分页查询广告列表
 * @param params 查询参数
 * @returns Promise<AxiosResponse<PaginationResult<AdvertiseItem>>>
 */
export const getAdvertiseList = (params: GetAdvertiseItemParams) => {
  const config: AxiosRequestConfig = {
    url: "/home/advertise/list",
    method: "GET",
    params,
  };
  return customRequest<AdvertiseItem[]>(config, "分页查询轮播广告列表");
};

/**
 * 修改广告信息
 * @param data 广告数据
 * @returns Promise<AxiosResponse<AdvertiseItem>>
 */
export const editAdvertise = (data: AdvertiseItem) => {
  const config: AxiosRequestConfig = {
    url: "/home/advertise/update",
    method: "PUT",
    data,
  };
  return customRequest(config, "修改轮播广告");
};

/**
 * 修改广告上下线状态
 * @param id 广告ID
 * @param status 状态值（0: 下线，1: 上线）
 * @returns Promise<AxiosResponse<void>>
 */
export const editAdvertiseStatus = (id: bigint, status: 0 | 1) => {
  const config: AxiosRequestConfig = {
    url: `/home/advertise/update/status/${id}/${status}`,
    method: "PUT",
  };
  return customRequest(config, "修改轮播广告状态");
};

/**
 * 获取广告详情
 * @param id 广告ID
 * @returns Promise<AxiosResponse<AdvertiseItem>>
 */
export const getAdvertiseDetail = (id: bigint) => {
  const config: AxiosRequestConfig = {
    url: `/home/advertise/${id}`,
    method: "GET",
  };
  return customRequest<AdvertiseItem>(config, "获取轮播广告详情");
};
