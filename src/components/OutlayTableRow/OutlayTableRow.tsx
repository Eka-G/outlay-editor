import { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import { Formik, Field, Form } from 'formik';

import { useUpdateRowMutation } from '@/api/outlayApi';
import EditorGroup from '@/components/EditorGroup';
import NumberField from '@/components/NumberField/NumberField';
import formatNumber from "@/shared/formatNumber";
import { OUTLAY_ROW_TEMPLATE } from '@/shared/constants';

import OutlayTableRowHeader from "./OutlayTableRowHeader";
import { RowProps } from './OutlayTableRow.types';
import './OutlayTableRow.style.scss';

export default function OutlayTableRow({ rowCells }: RowProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [updateRow] = useUpdateRowMutation();

  if (!rowCells) {
    return <OutlayTableRowHeader />;
  }

  const [isEditing, setIsEditing] = useState(false);
  const {
    level,
    id,
    total,
    parentId,
    contentToRender,
    editingRowIdInTable,
    setEditingRowIdInTable,
  } = rowCells;
  const initialValues = {
    rowName: contentToRender.rowName,
    salary: formatNumber(contentToRender.salary),
    equipmentCosts: formatNumber(contentToRender.equipmentCosts),
    overheads: formatNumber(contentToRender.overheads),
    estimatedProfit: formatNumber(contentToRender.estimatedProfit),
  }

  useEffect(() => {
    if (isEditing && formRef.current) {
      formRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    if (!editingRowIdInTable) {
      setIsEditing(true);
      setEditingRowIdInTable(id);
    }
  };

  const stopEditing = (
    e: React.KeyboardEvent<HTMLFormElement>,
    handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void
  ) => {
    if (e.key === 'Escape') {
      handleSubmit();
      setIsEditing(false);
      setEditingRowIdInTable(null);
    }
  };

  const renderCells = () => {
    return Object.entries(contentToRender).map(([key, value]) => {
      const isNumberField = typeof value === 'number';
      const fieldClasses = classnames("row__input", {
        "row__input--editing": isEditing,
      });

      return (
        <div className="row__cell" key={key}>
          {isNumberField ? (
            <Field
              name={key}
              component={NumberField}
              className={fieldClasses}
              disabled={!isEditing}
            />
          ) : (
            <Field
              name={key}
              type="text"
              className={fieldClasses}
              disabled={!isEditing}
            />
          )}
        </div>
      );
    });
  };

  const handleSubmit = async (values: typeof initialValues, setSubmitting: (isSubmitting: boolean) => void) => {
    try {
      const numericValues = {
        ...values,
        salary: Number(values.salary.replace(/\s+/g, '')),
        equipmentCosts: Number(values.equipmentCosts.replace(/\s+/g, '')),
        overheads: Number(values.overheads.replace(/\s+/g, '')),
        estimatedProfit: Number(values.estimatedProfit.replace(/\s+/g, '')),
      };

      await updateRow({ ...OUTLAY_ROW_TEMPLATE, ...numericValues, id, total });

      setIsEditing(false);
      setEditingRowIdInTable(null);
    } catch (error) {
      //TODO: add error handling
      console.error('Ошибка при обновлении строки:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting }) => handleSubmit(values, setSubmitting)}
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
        <Form
          ref={formRef}
          className="row"
          onKeyDown={(e) => stopEditing(e, handleSubmit)}
          onDoubleClick={handleDoubleClick}
          onBlur={handleBlur}
          tabIndex={0}
        >
          <EditorGroup key="editor-group" level={level} />
          {renderCells()}
        </Form>
      )}
    </Formik>
  );
}
