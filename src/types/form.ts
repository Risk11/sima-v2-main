import { FieldValues, Path, UseFormReturn } from 'react-hook-form'

export interface BaseForm<TForm extends FieldValues> {
  label: string,
  name: Path<TForm>,
  form: UseFormReturn<TForm>,
  placeholder?: string,
  className?: string
}

export interface Option {
  label: string,
  value: string | number,
}