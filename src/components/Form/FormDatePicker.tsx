import * as React from "react";
import { format, type Locale } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverAnchor,
} from "@/components/ui/popover";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useFormField } from "./FormField";
import { cn } from "@/lib/utils";

interface FormDatePickerProps {
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  minDate?: Date;
  maxDate?: Date;
  dateFormat?: string;
  locale?: Locale;
}

export const FormDatePicker = React.forwardRef<
  HTMLInputElement,
  FormDatePickerProps
>(
  (
    {
      placeholder = "Selecciona una fecha",
      className,
      disabled,
      value,
      onChange,
      minDate,
      maxDate,
      dateFormat = "PPP",
      locale = es,
    },
    ref
  ) => {
    const { error, formItemId, formDescriptionId, formMessageId } =
      useFormField();
    const [open, setOpen] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Merge refs
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const handleSelect = (date: Date | undefined) => {
      onChange?.(date);
      setOpen(false);
      // Return focus to input after selection
      inputRef.current?.focus();
    };

    const handleFocus = () => {
      if (!disabled) {
        setOpen(true);
      }
    };

    const displayValue = value ? format(value, dateFormat, { locale }) : "";

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <InputGroup className={cn(error && "border-destructive", className)}>
            <InputGroupAddon align="inline-start">
              <CalendarIcon className="h-4 w-4" />
            </InputGroupAddon>
            <PopoverTrigger asChild>
              <InputGroupInput
                ref={inputRef}
                id={formItemId}
                readOnly
                disabled={disabled}
                placeholder={placeholder}
                value={displayValue}
                onFocus={handleFocus}
                aria-describedby={
                  !error
                    ? `${formDescriptionId}`
                    : `${formDescriptionId} ${formMessageId}`
                }
                aria-invalid={!!error}
                className="cursor-pointer"
              />
            </PopoverTrigger>
          </InputGroup>
        </PopoverAnchor>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleSelect}
            disabled={(date) => {
              if (minDate && date < minDate) return true;
              if (maxDate && date > maxDate) return true;
              return false;
            }}
            locale={locale}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  }
);

FormDatePicker.displayName = "FormDatePicker";
