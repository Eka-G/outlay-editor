export type RowCells = {
  level: number;
  id: number;
  parentId: number | null;
  contentToRender: {
    rowName: string;
    salary: string | number;
    equipmentCosts: string | number;
    overheads: string | number;
    estimatedProfit: string | number;
  }
  editingRowIdInTable: number | null;
  setEditingRowIdInTable: (id: number | null) => void;
};

export type RowProps = {
  rowCells?: RowCells;
};
