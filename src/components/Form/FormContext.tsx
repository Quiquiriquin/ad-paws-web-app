import * as React from "react"
import type {
  UseFormReturn,
  FieldValues,
} from "react-hook-form"

export type FormContextValue<TFieldValues extends FieldValues = FieldValues> =
  UseFormReturn<TFieldValues>

const FormContext = React.createContext<FormContextValue | null>(null)

export function useFormContext<TFieldValues extends FieldValues = FieldValues>() {
  const context = React.useContext(FormContext) as FormContextValue<TFieldValues> | null
  
  if (!context) {
    throw new Error("useFormContext must be used within a Form component")
  }
  
  return context
}

export const FormProvider = FormContext.Provider

