import { OutlayRowWithChild, OutlayRowWithParentId } from "@/shared/types";

const UNEXISTING_ROW_ID = -1;

export function makeEmptyRow(): OutlayRowWithChild {
  return {
    id: UNEXISTING_ROW_ID,
    rowName: '',
    salary: 0,
    equipmentCosts: 0,
    overheads: 0,
    estimatedProfit: 0,
    machineOperatorSalary: 0,
    mainCosts: 0,
    materials: 0,
    mimExploitation: 0,
    supportCosts: 0,
    total: 0,
    child: [],
  }
}

export function updateRowsInTree(
  draft: OutlayRowWithChild[],
  newRow: OutlayRowWithParentId,
  currentResponceRow: OutlayRowWithChild | null,
  changedResponceRows: OutlayRowWithChild[]
): OutlayRowWithChild[] {
  if (!currentResponceRow || !newRow) {
    return draft;
  }

  return draft.map(rowFromStore => {
    const rowToUpdate = changedResponceRows.find((responceRow) => responceRow.id === rowFromStore.id);

    if (rowFromStore.id === newRow.parentId) {
      return {
        ...rowFromStore,
        child: [...(rowFromStore.child || []), { ...newRow, child: [] }]
      } as OutlayRowWithChild;
    }

    if (rowToUpdate) {
      return {
        ...rowFromStore,
        ...rowToUpdate,
      } as OutlayRowWithChild;
    }

    return rowFromStore;
  });
};
