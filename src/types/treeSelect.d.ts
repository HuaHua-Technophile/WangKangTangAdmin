export interface TreeSelectItem {
  id?: number;
  label?: string;
  name?: string; // 若有name，则使用name作为label，否则使用label作为label
  value?: number;
  children?: TreeSelectItem[];
  parentId?: number; // 父节点ID
}
export interface TreeSelectOptions {
  flat: TreeSelectItem[];
  rootLabel?: string;
  rootId?: number;
  rootValue?: number;
}
