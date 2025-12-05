import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { useFormField } from "./FormField";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectOptionGroup {
  label: string;
  options: SelectOption[];
}

interface FormSelectProps {
  placeholder?: string;
  options?: SelectOption[];
  groups?: SelectOptionGroup[];
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
  size?: "sm" | "default";
  value?: string;
  onValueChange?: (value: string) => void;
}

export const FormSelect = React.forwardRef<HTMLButtonElement, FormSelectProps>(
  (
    {
      placeholder = "Selecciona una opción",
      options = [],
      groups = [],
      className,
      triggerClassName,
      contentClassName,
      disabled,
      size = "default",
      value,
      onValueChange,
    },
    ref
  ) => {
    const { error, formItemId, formDescriptionId, formMessageId } =
      useFormField();

    const hasGroups = groups.length > 0;

    return (
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger
          ref={ref}
          id={formItemId}
          aria-describedby={
            !error
              ? `${formDescriptionId}`
              : `${formDescriptionId} ${formMessageId}`
          }
          aria-invalid={!!error}
          size={size}
          className={cn("w-full", triggerClassName, className)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={contentClassName}>
          {hasGroups
            ? groups.map((group) => (
                <SelectGroup key={group.label}>
                  <SelectLabel>{group.label}</SelectLabel>
                  {group.options.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))
            : options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
        </SelectContent>
      </Select>
    );
  }
);

FormSelect.displayName = "FormSelect";

