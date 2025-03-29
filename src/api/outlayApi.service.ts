import { OUTLAY_ROW_TEMPLATE } from "@/shared/constants";
import { OutlayRowWithChild, OutlayRowWithParentId } from "@/shared/types";

const UNEXISTING_ROW_ID = -1;

export function makeEmptyRow(): OutlayRowWithChild {
  return {
    ...OUTLAY_ROW_TEMPLATE,
    id: UNEXISTING_ROW_ID,
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
