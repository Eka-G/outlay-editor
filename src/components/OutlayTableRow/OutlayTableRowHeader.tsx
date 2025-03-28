import classnames from 'classnames';
import './OutlayTableRow.style.scss';

const TABLE_HEADERS = {
  level: 'Уровень',
  rowName: 'Наименование работ',
  salary: 'Основная з/п',
  equipmentCosts: 'Оборудование',
  overheads: 'Накладные расходы',
  estimatedProfit: 'Сметная прибыль',
};

export default function OutlayTableHeader() {
  return (
    <div className="row">
      {Object.values(TABLE_HEADERS).map((value) => {
        return (
          <p
            key={value}
            className={classnames(
              "row__cell",
              "row__cell--header"
            )}
          >
            {value}
          </p>
        );
      })}
    </div>
  );
}
