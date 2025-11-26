/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { useFormContext } from "./FormContext";
import { Field } from "@/components/ui/field";
import { cn } from "@/lib/utils";

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

export const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const formContext = useFormContext();

  const fieldState = formContext.getFieldState(
    fieldContext.name,
    formContext.formState
  );

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = React.useId
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      { id: React.useId() }
    : { id: fieldContext.name };

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  const form = useFormContext<TFieldValues>();

  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller control={form.control} {...props} />
    </FormFieldContext.Provider>
  );
};

export const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { invalid } = useFormField();

  return (
    <Field
      ref={ref}
      data-invalid={invalid}
      className={cn(className)}
      {...props}
    />
  );
});
FormItem.displayName = "FormItem";
