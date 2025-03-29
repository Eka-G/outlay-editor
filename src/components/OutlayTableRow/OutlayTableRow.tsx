import { useState, useRef, useEffect } from "react";
import classnames from "classnames";
import { Formik, Field, Form } from "formik";
import { isEqual } from "lodash";

import {
  useUpdateRowMutation,
  useCreateRowMutation,
  useDeleteEmptyRowMutation,
} from "@/api/outlayApi";
import EditorGroup from "@/components/EditorGroup";
import NumberField from "@/components/NumberField/NumberField";
import formatNumber from "@/shared/formatNumber";
import { OUTLAY_ROW_TEMPLATE, UNEXISTING_ROW_ID } from "@/shared/constants";

import OutlayTableRowHeader from "./OutlayTableRowHeader";
import { RowProps } from "./OutlayTableRow.types";
import "./OutlayTableRow.style.scss";

export default function OutlayTableRow({ rowCells }: RowProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [ updateRow ] = useUpdateRowMutation();
  const [ createRow ] = useCreateRowMutation();
  const [ deleteEmptyRow ] = useDeleteEmptyRowMutation();

  if (!rowCells) {
    return <OutlayTableRowHeader />;
  }

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
  };

  const [ isEditing, setIsEditing ] = useState(id === editingRowIdInTable);

  useEffect(() => {
    if (isEditing && formRef.current) {
      const firstInput = formRef.current.querySelector("input");
      firstInput?.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (editingRowIdInTable === null && !isEditing) {
      const target = e.target as HTMLElement;
      setIsEditing(true);
      setEditingRowIdInTable(id);

      if (target.tagName === "INPUT") {
        target.focus();
      }
    }
  };

  const stopEditing = async (
    e: React.KeyboardEvent<HTMLFormElement>,
    values: typeof initialValues,
    handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void
  ) => {
    if (e.key === "Escape") {
      const isRowChanged = !isEqual(initialValues, values);

      if (isRowChanged) {
        await handleSubmit();
      } else {
        if (editingRowIdInTable === UNEXISTING_ROW_ID) {
          await deleteEmptyRow({ parentId });
        }

        setIsEditing(false);
        setEditingRowIdInTable(null);
      }

      return;
    }
  };

  const renderCells = () => {
    return Object.entries(contentToRender).map(([key, value]) => {
      const isNumberField = typeof value === "number";
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
              minLength={3}
              disabled={!isEditing}
            />
          )}
        </div>
      );
    });
  };

  const handleSubmit = async (
    values: typeof initialValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    try {
      const numericValues = {
        ...values,
        salary: Number(values.salary.replace(/\s+/g, '')),
        equipmentCosts: Number(values.equipmentCosts.replace(/\s+/g, '')),
        overheads: Number(values.overheads.replace(/\s+/g, '')),
        estimatedProfit: Number(values.estimatedProfit.replace(/\s+/g, '')),
      };

      if (editingRowIdInTable === UNEXISTING_ROW_ID) {
        await createRow({
          ...OUTLAY_ROW_TEMPLATE,
          ...numericValues,
          parentId,
        });
      } else if (editingRowIdInTable) {
        await updateRow({
          ...OUTLAY_ROW_TEMPLATE,
          ...numericValues,
          id,
          total,
        });
      }

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
      key={JSON.stringify(initialValues)}
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting }) =>
        handleSubmit(values, setSubmitting)
      }
    >
      {({ values, handleSubmit }) => (
        <Form
          ref={formRef}
          className="row"
          onKeyDown={(e) => stopEditing(e, values, handleSubmit)}
          onDoubleClick={handleDoubleClick}
          tabIndex={0}
        >
          <EditorGroup
            key="editor-group"
            level={level}
            id={id}
            isTableEditing={editingRowIdInTable !== null}
            setEditingRowIdInTable={setEditingRowIdInTable}
          />
          {renderCells()}
        </Form>
      )}
    </Formik>
  );
}
