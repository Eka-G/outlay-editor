import { useState } from 'react';
import { useGetAllRowsQuery } from '@/api/outlayApi';
import { OutlayTableRow } from '@/components';

import './OutlayTable.style.scss';

export default function OutlayTable() {
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const { data } = useGetAllRowsQuery();

  const renderRows = () => {
    if (!data) {
      return null;
    }

    const processRow = (row: any, level: number = 0) => {
      const rowCells = {
        level,
        id: row.id,
        parentId: row.parentId,
        contentToRender: {
          rowName: row.rowName,
          salary: row.salary,
          equipmentCosts: row.equipmentCosts,
          overheads: row.overheads,
          estimatedProfit: row.estimatedProfit,
        },
        editingRowIdInTable: editingRowId,
        setEditingRowIdInTable: setEditingRowId,
      };

      const rows = [
        <li className="outlay-table__row">
          <OutlayTableRow key={row.id} rowCells={rowCells} />
        </li>,
      ];

      if (row.child && row.child.length > 0) {
        row.child.forEach((childRow: any) => {
          rows.push(...processRow(childRow, level + 1));
        });
      }

      return rows;
    };

    return data.map((row) => processRow(row)).flat();
  }; 

  return (
    <ul className="outlay-table">
      <li className="outlay-table__row">
        <OutlayTableRow key="row-header" />
      </li>

      {renderRows()}
    </ul>
  );
}
