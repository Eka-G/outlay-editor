import React from 'react';
import { FieldProps } from 'formik';
import formatNumber from '@/shared/formatNumber';

interface NumberFieldProps extends FieldProps {
  className?: string;
  disabled?: boolean;
}

export default function NumberField({
  field,
  form,
  ...props
}: NumberFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatNumber(
      Number(e.target.value.replace(/\D/g, ''))
    );
    form.setFieldValue(field.name, formattedValue);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (field.value) {
      form.setFieldValue(field.name, field.value);
    }

    field.onBlur(e);
  };

  return (
    <input
      {...field}
      {...props}
      value={formatNumber(Number(field.value.replace(/\D/g, ''))) || ''}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};
