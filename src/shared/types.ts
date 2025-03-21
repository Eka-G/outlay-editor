type OutlayRowBaseInfo = {
  equipmentCosts: number;
  estimatedProfit: number;
  machineOperatorSalary: number;
  mainCosts: number;
  materials: number;
  mimExploitation: number;
  overheads: number;
  rowName: string;
  salary: number;
  supportCosts: number;
};

export type OutlayRow = OutlayRowBaseInfo & {
  id: number;
  total: number;
};

export type OutlayRowWithParentId = OutlayRowBaseInfo & {
  parentId: number | null;
};

type OutlayRowWithChild = OutlayRow & {
  child: OutlayRow[];
};

export type OutlayAllRowsResponse = OutlayRowWithChild[];

export type OutlayRowResponse = {
  current: null | OutlayRow;
  changed: OutlayRow[];
};
