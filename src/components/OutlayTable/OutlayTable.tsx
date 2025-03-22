import { useGetAllRowsQuery } from '@/api/outlayApi';
import { OutlayTableRow } from '@/components';

import './OutlayTable.style.scss';

export default function OutlayTable() {
  const { data } = useGetAllRowsQuery();

  const renderRows = () => {
    if (!data) {
      return null;
    }

    const processRow = (row: any, level: number = 0) => {
      const rowCells = {
        rowName: row.rowName,
        salary: row.salary,
        equipmentCosts: row.equipmentCosts,
        overheads: row.overheads,
        estimatedProfit: row.estimatedProfit,
      };

      const rows = [
        <OutlayTableRow
          key={row.id}
          level={level.toString()}
          rowCells={rowCells}
        />,
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
      <OutlayTableRow />
      {renderRows()}
    </ul>
  );
}
