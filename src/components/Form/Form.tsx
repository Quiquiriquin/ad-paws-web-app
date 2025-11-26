import * as React from "react";
import {
  useForm,
  type SubmitHandler,
  type FieldValues,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { FormProvider, type FormContextValue } from "./FormContext";

export interface FormProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<React.ComponentPropsWithoutRef<"form">, "onSubmit"> {
  form?: UseFormReturn<TFieldValues>;
  onSubmit: SubmitHandler<TFieldValues>;
  formOptions?: UseFormProps<TFieldValues>;
}

function FormComponent<TFieldValues extends FieldValues = FieldValues>(
  {
    form: externalForm,
    onSubmit,
    formOptions,
    children,
    className,
    ...props
  }: FormProps<TFieldValues>,
  ref: React.ForwardedRef<HTMLFormElement>
) {
  // Use external form or create an internal one
  const internalForm = useForm<TFieldValues>(formOptions);
  const form = externalForm || internalForm;

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <FormProvider value={form as FormContextValue}>
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className={cn("space-y-6", className)}
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
}

export const Form = React.forwardRef(FormComponent) as <
  TFieldValues extends FieldValues = FieldValues
>(
  props: FormProps<TFieldValues> & { ref?: React.ForwardedRef<HTMLFormElement> }
) => React.ReactElement;
