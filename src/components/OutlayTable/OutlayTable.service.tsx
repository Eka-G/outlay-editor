import { OutlayRowWithChild } from "@/shared/types";

const UNEXISTING_ROW_ID = -1;

export const makeRowCellsTemplate = (
  editingRowId: number | null,
  setEditingRowId: React.Dispatch<React.SetStateAction<number | null>>,
  row?: OutlayRowWithChild,
  level?: number,
  parentId?: number | null
) => ({
  level: level ?? 0,
  id: row?.id ?? UNEXISTING_ROW_ID,
  parentId: parentId ?? null,
  total: row?.total ?? 0,
  contentToRender: {
    rowName: row?.rowName ?? '',
    salary: row?.salary ?? 0,
    equipmentCosts: row?.equipmentCosts ?? 0,
    overheads: row?.overheads ?? 0,
    estimatedProfit: row?.estimatedProfit ?? 0,
  },
  editingRowIdInTable: editingRowId ?? null,
  setEditingRowIdInTable: setEditingRowId,
});
