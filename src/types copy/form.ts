import { FieldValues, Path, UseFormReturn } from 'react-hook-form'

export interface BaseForm<TForm extends FieldValues> {
  label: string,
  name: Path<TForm>,
  form: UseFormReturn<TForm>,
  placeholder?: string,
  className?: string,
  accept?:string
}

export interface Option {
  label: string,
  value: string,
}

export type OptionWithId = {
  id: string | number
  label: string
}