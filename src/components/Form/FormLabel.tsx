import * as React from "react";
import { FieldLabel } from "@/components/ui/field";
import { useFormField } from "./FormField";
import { cn } from "@/lib/utils";

export const FormLabel = React.forwardRef<
  React.ElementRef<typeof FieldLabel>,
  React.ComponentPropsWithoutRef<typeof FieldLabel>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <FieldLabel
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";
