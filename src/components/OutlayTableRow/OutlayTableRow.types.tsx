export type FormValues = {
  rowName: string;
  salary: string;
  equipmentCosts: string;
  overheads: string;
  estimatedProfit: string;
};

export type CellsToRender = {
  rowName: string;
  salary: number;
  equipmentCosts: number;
  overheads: number;
  estimatedProfit: number;
};

export type RowProps = {
  rowCells?: {
    level: number;
    id: number;
    parentId: number | null;
    total: number;
    contentToRender: CellsToRender;
    editingRowIdInTable: number | null;
    isCreatingNewRow: boolean;
    setEditingRowIdInTable: (id: number | null) => void;
    setIsCreatingNewRow: (isCreating: boolean) => void;
  };
};
