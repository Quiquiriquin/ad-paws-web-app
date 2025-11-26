import { LOGIN_MUTATION } from "@/lib/api/user.api";
import { useMutation } from "@apollo/client/react";
import { useEffect } from "react";
import LoginForm from "@/components/Form/Forms/LoginForm";
import Logo from "@/components/Logo";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function Login() {
  const [signInUser, { loading, data }] = useMutation(LOGIN_MUTATION);

  const onSubmit = (formData: LoginFormValues) => {
    signInUser({ variables: { input: formData } });
  };

  useEffect(() => {
    if (data) {
      console.log("Login data:", data);
    }
  }, [data]);

  return (
    <div className="w-full max-w-[400px] border border-border rounded-lg p-6 bg-card">
      <div className="flex items-center justify-center mb-4">
        <Logo className="w-48" />
      </div>
      <div className="mb-6">
        <p className="text-2xl font-bold text-center mb-2">
          Incia sesión en tu cuenta
        </p>
        <p className="text-sm text-center text-muted-foreground font-medium">
          ¡Bienvenido de nuevo!
        </p>
      </div>
      <LoginForm onSubmit={onSubmit} loading={loading} />
    </div>
  );
}
