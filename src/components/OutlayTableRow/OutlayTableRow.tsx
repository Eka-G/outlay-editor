import classnames from 'classnames';
import { RowCells, RowProps } from './OutlayTableRow.types';
import './OutlayTableRow.style.scss';

const TABLE_HEADERS = {
  rowName: 'Наименование работ',
  salary: 'Основная з/п',
  equipmentCosts: 'Оборудование',
  overheads: 'Накладные расходы',
  estimatedProfit: 'Сметная прибыль',
};

export default function OutlayTableRow({rowCells}: RowProps) {
  const renderCells = (cells: RowCells, isHeader: boolean = false) => {
    const cellsArray = Object.values(cells).map((value) => {
      return (
        <p
          key={value}
          className={classnames("row__cell", { "row__cell--header": isHeader })}
        >
          {typeof value === 'number' ? Intl.NumberFormat('ru-RU').format(value) : value}
        </p>
      );
    })

    return (
      <>
        {isHeader ? <p
        key="level"
        className={classnames("row__cell", "row__cell--header")}
      >
        Уровень
      </p> : <div className="row__cell"></div>}
      {cellsArray}
      </>
    );
  }

  return (
    <li className="row">
      {rowCells ? renderCells(rowCells) : renderCells(TABLE_HEADERS, true)}
    </li>
  );
}
