import { MenuTreeItem } from "@/types/system/menu/menu";

export const formatTreeSelect = (data: any[]) => {
  return [
    {
      label: "根目录",
      id: 0,
      value: 0,
      children: data.map((item) => ({
        label: item.label,
        id: item.id,
        value: item.id,
        children: formatChildren(item.children),
      })),
    },
  ];
};

// 辅助函数：格式化子节点
const formatChildren = (children: MenuTreeItem[] = []): MenuTreeItem[] => {
  return children.map((child) => ({
    label: child.label,
    id: child.id,
    value: child.id,
    children: formatChildren(child.children),
  }));
};
