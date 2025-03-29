import { useCallback, useState } from 'react';
import { useGetAllRowsQuery, useAddEmptyRowMutation } from '@/api/outlayApi';
import { OutlayTableRow } from '@/components';
import { OutlayRowWithChild } from '@/shared/types';
import './OutlayTable.style.scss';
import { makeRowCellsTemplate } from "./OutlayTable.service";

export default function OutlayTable() {
  const { data } = useGetAllRowsQuery();
  const [ editingRowId, setEditingRowId ] = useState<number | null>(null);

  const renderRows = useCallback(() => {
    if (!data) {
      return null;
    }

    const processRow = (row: OutlayRowWithChild, level: number = 0, parentId: number | null = null) => {
      const rowCells = makeRowCellsTemplate(
        editingRowId,
        setEditingRowId,
        row,
        level,
        parentId,
      );

      const rows = [
        <li key={row.id} className="outlay-table__row">
          <OutlayTableRow rowCells={rowCells} />
        </li>,
      ];

      if (row.child && row.child.length > 0) {
        row.child.forEach((childRow: any) => {
          rows.push(...processRow(childRow, level + 1, row.id));
        });
      }

      return rows;
    };

    return data.map((row) => processRow(row)).flat();
  }, [ data, editingRowId ]);

  return (
    <ul className="outlay-table">
      <li key="table-header" className="outlay-table__row">
        <OutlayTableRow />
      </li>

      {renderRows()}
    </ul>
  );
}
