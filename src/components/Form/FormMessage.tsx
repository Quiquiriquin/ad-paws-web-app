import * as React from "react";
import { FieldError } from "@/components/ui/field";
import { useFormField } from "./FormField";
import { cn } from "@/lib/utils";

export const FormMessage = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof FieldError>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <FieldError
      ref={ref}
      id={formMessageId}
      className={cn(`text-xs! mt-[-8px] text-left`, className)}
      {...props}
    >
      {body}
    </FieldError>
  );
});
FormMessage.displayName = "FormMessage";
