import { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import { Formik } from 'formik';
import EditorGroup from '@/components/EditorGroup';

import OutlayTableRowHeader from "./OutlayTableRowHeader";
import { RowProps } from './OutlayTableRow.types';
import './OutlayTableRow.style.scss';

export default function OutlayTableRow({ rowCells }: RowProps) {
  const formRef = useRef<HTMLFormElement>(null);

  if (!rowCells) {
    return <OutlayTableRowHeader />;
  }

  const [isEditing, setIsEditing] = useState(false);
  const {
    level,
    id,
    parentId,
    contentToRender,
    editingRowIdInTable,
    setEditingRowIdInTable,
  } = rowCells;

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

  const renderCells = (
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void
  ) => {
    return Object.entries(contentToRender).map(([key, value]) => {
      const formattedValue =
        typeof value === 'number'
          ? Intl.NumberFormat('ru-RU').format(value)
          : value || '';

      return (
        <div className="row__cell">
          <input
            key={key}
            className={classnames("row__input", {
            "row__input--editing": isEditing,
          })}
          type="text"
          name={key}
          onChange={handleChange}
          value={formattedValue}
            disabled={!isEditing}
          />
        </div>
      );
    });
  };

  return (
    <Formik
      initialValues={{
        rowName: contentToRender.rowName || '',
        salary: contentToRender.salary || '',
        equipmentCosts: contentToRender.equipmentCosts || '',
        overheads: contentToRender.overheads || '',
        estimatedProfit: contentToRender.estimatedProfit || '',
      }}
      onSubmit={(values, { setSubmitting }) => {
        setIsEditing(false);
        setSubmitting(false);
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
        <form 
          ref={formRef}
          className="row" 
          onKeyDown={(e) => stopEditing(e, handleSubmit)}
          onDoubleClick={handleDoubleClick}
          tabIndex={0}
        >
          <EditorGroup key="editor-group" level={Number(level) || 0} />
          {renderCells(handleChange, handleBlur)}
        </form>
      )}
    </Formik>
  );
}
