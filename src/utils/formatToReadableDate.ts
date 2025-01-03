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
