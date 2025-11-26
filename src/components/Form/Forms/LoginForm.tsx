import React from "react";
import { Form } from "@/components/Form/Form";
import { FieldSet } from "@/components/ui/field";
import { FormItem } from "@/components/Form";
import { FormLabel } from "@/components/Form";
import { FormControl } from "@/components/Form";
import { FormMessage } from "@/components/Form";
import { FormField } from "@/components/Form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginForm({
  onSubmit,
  loading,
}: {
  onSubmit: (data: LoginFormValues) => void;
  loading: boolean;
}): React.ReactElement {
  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  return (
    <Form form={form} onSubmit={onSubmit}>
      <FieldSet className="w-full">
        <FormField
          name="email"
          rules={{
            required: "El email es requerido",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Email inválido",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Ingresa tu email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="password"
          rules={{
            required: "La contraseña es requerida",
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </FieldSet>

      <Button
        type="submit"
        size="lg"
        disabled={
          form.formState.isSubmitting || !form.formState.isValid || loading
        }
        className="w-full"
      >
        {form.formState.isSubmitting ? "Iniciando sesión..." : "Inicia sesión"}
      </Button>
    </Form>
  );
}
