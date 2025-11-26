import * as React from "react"
import { FieldDescription } from "@/components/ui/field"
import { useFormField } from "./FormField"
import { cn } from "@/lib/utils"

export const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <FieldDescription
      ref={ref}
      id={formDescriptionId}
      className={cn(className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

