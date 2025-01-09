/**
 * @file AptitudeItem.ts
 * @description 定义与资质项相关的接口类型，用于描述资质项数据结构。
 * @author [您的姓名]
 * @date [当前日期]
 */

/**
 * 表示一个资质项的数据结构。
 * @interface AptitudeItem
 */
export interface AptitudeItem {
  /**
   * 资质项的唯一标识符（可选）。
   * @type {number | undefined}
   */
  id?: number;

  /**
   * 资质项的排序值，用于决定显示顺序。
   * @type {number}
   */
  sort: number;

  /**
   * 资质项的图片地址（可选）。
   * @type {string | undefined}
   */
  image?: string;
}
