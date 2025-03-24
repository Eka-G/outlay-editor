import React from 'react';
import { FieldProps } from 'formik';
import formatNumber from '@/shared/formatNumber';

interface NumberFieldProps extends FieldProps {
  className?: string;
  disabled?: boolean;
}

export default function NumberField({ field, form, ...props }: NumberFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    form.setFieldValue(field.name, value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = field.value;

    if (value) {
      const formattedValue = formatNumber(value);
      form.setFieldValue(field.name, formattedValue);
    }

    field.onBlur(e);
  };

  return (
    <input
      {...field}
      {...props}
      value={field.value || ''}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};
