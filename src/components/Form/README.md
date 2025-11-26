# Form Component - React Hook Form Wrapper

A comprehensive form wrapper component built on top of `react-hook-form` that integrates seamlessly with your existing UI components.

## Features

- 🎯 Full TypeScript support with type safety
- 🔄 Flexible - use with or without external form instance
- 🎨 Integrates with existing Field components
- ✨ Automatic error handling and display
- 🚀 All react-hook-form features available
- 📝 Built-in validation support

## Components

### Form
The main form wrapper that provides react-hook-form context to all child components.

**Props:**
- `form?: UseFormReturn<TFieldValues>` - Optional external form instance from `useForm()`
- `onSubmit: SubmitHandler<TFieldValues>` - Submit handler function
- `formOptions?: UseFormProps<TFieldValues>` - Options for internal form instance (if no external form provided)
- All standard HTML form props

### FormField
Controller wrapper for form fields.

**Props:**
- `name: string` - Field name
- `rules?: ValidationRules` - Validation rules
- `render: ({ field }) => React.ReactElement` - Render function
- All Controller props from react-hook-form

### FormItem
Container for a form field with proper styling and error states.

### FormLabel
Label component that automatically handles error states and accessibility.

### FormControl
Wrapper for input components that handles aria attributes and error states.

### FormDescription
Optional description text for a form field.

### FormMessage
Automatically displays validation error messages.

## Usage Examples

### Example 1: Simple Form (No External Form Instance)

```tsx
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/Form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SimpleForm() {
  const onSubmit = (data: { email: string; password: string }) => {
    console.log(data)
  }

  return (
    <Form onSubmit={onSubmit}>
      <FormField
        name="email"
        rules={{ required: "Email is required" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="Enter your email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="password"
        rules={{ 
          required: "Password is required",
          minLength: { value: 8, message: "Password must be at least 8 characters" }
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="Enter your password" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button type="submit">Submit</Button>
    </Form>
  )
}
```

### Example 2: Form with External Form Instance

```tsx
import { useForm } from "react-hook-form"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/Form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface LoginFormValues {
  email: string
  password: string
}

export function LoginForm() {
  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange", // Validate on change
  })

  const onSubmit = (data: LoginFormValues) => {
    console.log(data)
  }

  return (
    <Form form={form} onSubmit={onSubmit}>
      <FormField
        name="email"
        rules={{
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address",
          },
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="Enter your email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="password"
        rules={{
          required: "Password is required",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
          },
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="Enter your password" {...field} />
            </FormControl>
            <FormDescription>
              Your password must be at least 8 characters long
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex gap-4">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Submitting..." : "Submit"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => form.reset()}
        >
          Reset
        </Button>
      </div>
    </Form>
  )
}
```

### Example 3: Accessing Form Methods

```tsx
import { useForm } from "react-hook-form"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  useFormContext,
} from "@/components/Form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface FormValues {
  name: string
  age: number
}

// Custom component that uses form context
function FormActions() {
  const form = useFormContext<FormValues>()
  
  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          form.setValue("name", "John Doe")
          form.setValue("age", 25)
        }}
      >
        Set Default Values
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={async () => {
          const isValid = await form.trigger()
          console.log("Form is valid:", isValid)
        }}
      >
        Validate
      </Button>
    </div>
  )
}

export function FormWithMethods() {
  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      age: 0,
    },
  })

  const onSubmit = (data: FormValues) => {
    console.log(data)
  }

  // Watch form values
  const watchName = form.watch("name")

  return (
    <div>
      <p className="mb-4">Current name: {watchName || "Not set"}</p>

      <Form form={form} onSubmit={onSubmit}>
        <FormActions />

        <FormField
          name="name"
          rules={{ required: "Name is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="age"
          rules={{
            required: "Age is required",
            min: { value: 18, message: "Must be at least 18" },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter your age"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </Form>
    </div>
  )
}
```

## Available React Hook Form Methods

When using an external form instance, you have access to all react-hook-form methods:

- `watch(name?)` - Watch form values
- `setValue(name, value)` - Set field value
- `getValues(name?)` - Get form values
- `reset(values?)` - Reset form
- `trigger(name?)` - Trigger validation
- `setError(name, error)` - Set field error
- `clearErrors(name?)` - Clear errors
- `formState` - Access form state (errors, isDirty, isValid, etc.)

## Validation

You can use built-in validation rules or integrate with schema validation libraries like Zod or Yup:

### Built-in Validation Rules

```tsx
<FormField
  name="email"
  rules={{
    required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address"
    },
    minLength: { value: 5, message: "Too short" },
    maxLength: { value: 50, message: "Too long" },
  }}
  render={({ field }) => (
    // ...
  )}
/>
```

### With Zod (requires @hookform/resolvers)

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type FormValues = z.infer<typeof schema>

const form = useForm<FormValues>({
  resolver: zodResolver(schema),
  defaultValues: {
    email: "",
    password: "",
  },
})
```

## API Reference

### useFormContext

Hook to access the form context from child components.

```tsx
const form = useFormContext<YourFormType>()
```

### useFormField

Hook to access field-specific data within FormField render function.

```tsx
const { error, invalid } = useFormField()
```

## TypeScript Support

All components are fully typed. When using with TypeScript, specify your form values type:

```tsx
interface MyFormValues {
  email: string
  password: string
}

const form = useForm<MyFormValues>()

<Form<MyFormValues> form={form} onSubmit={onSubmit}>
  {/* ... */}
</Form>
```

## Notes

- The Form component automatically calls `form.handleSubmit()` for you
- FormMessage automatically displays the error message for its field
- All Field components support the existing Field component styling
- FormControl uses Radix UI's Slot component for proper prop forwarding

