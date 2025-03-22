export type RowCells = {
  rowName: string;
  salary: string | number;
  equipmentCosts: string | number;
  overheads: string | number;
  estimatedProfit: string | number;
};

export type RowProps = {
  level?: string;
  id?: number;
  parentId?: number;
  rowCells?: RowCells;
};
