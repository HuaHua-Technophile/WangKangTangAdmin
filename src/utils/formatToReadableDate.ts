/**
 * 格式化日期字符串为可读的日期格式
 * @module formatToReadableDate
 */

/**
 * 将日期字符串格式化为可读的日期格式。
 *
 * @param {string} dateString - 要格式化的日期字符串，必须是ISO格式或其他可被`Date`对象解析的格式。
 * @param {boolean} [shortFormatType=false] - 是否使用短格式。短格式为`MM-DD HH:mm`，长格式为`YYYY年MM月DD日 HH时mm分ss秒`。
 * @returns {string} 格式化后的日期字符串。如果`dateString`无效，则返回`"无"`。
 *
 * @example
 * // 返回 "2023年10月05日 14时30分45秒"
 * formatToReadableDate("2023-10-05T14:30:45Z");
 *
 * @example
 * // 返回 "10-05 14:30"
 * formatToReadableDate("2023-10-05T14:30:45Z", true);
 *
 * @example
 * // 返回 "无"
 * formatToReadableDate("");
 */
export const formatToReadableDate = (
  dateString: string,
  shortFormatType?: boolean
): string => {
  if (!dateString) return "无";

  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return shortFormatType
    ? `${month}-${day} ${hours}:${minutes}`
    : `${year}年${month}月${day}日 ${hours}时${minutes}分${seconds}秒`;
};
