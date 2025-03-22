import { Formik } from 'formik';
import EditorGroup from '@/components/EditorGroup';

import OutlayTableRowHeader from "./OutlayTableRowHeader";
import { RowCells, RowProps } from './OutlayTableRow.types';
import './OutlayTableRow.style.scss';

export default function OutlayTableRow({ level, rowCells }: RowProps) {
  const renderForm = (cells: RowCells) => {
    const makeCells = (
      handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
      handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void
    ) =>
      Object.values(cells).map((value) => {
        const formattedValue =
          typeof value === 'number'
            ? Intl.NumberFormat('ru-RU').format(value)
            : value;

        return (
          <input
            className="row-content__cell"
            type="text"
            name="rowName"
            onChange={handleChange}
            onBlur={handleBlur}
            value={formattedValue}
          />
        );
      });

    return (
      <Formik
        initialValues={{
          rowName: '',
          salary: '',
          equipmentCosts: '',
          overheads: '',
          estimatedProfit: '',
        }}
        // validate={(values) => {
        //   const errors: { [key: string]: string } = {};
        //   if (!values.rowName) {
        //     errors.rowName = "Обязательное поле";
        //   } else if (values.rowName.length < 3) {
        //     errors.rowName = "Некорректное значение";
        //   }
        //   return errors;
        // }}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form className="row-content" onSubmit={handleSubmit}>
            <EditorGroup level={Number(level) || 0} />
            {makeCells(handleChange, handleBlur)}
          </form>
        )}
      </Formik>
    );
  };

  return <li className="row">{rowCells ? renderForm(rowCells) : <OutlayTableRowHeader />}</li>;
}
