import { useForm } from "@westbrookdaniel/form/react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "../trpc";
import { useAuth } from "../main";

export function Login() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Login</h1>
      <LoginForm />
    </main>
  );
}

type FormState = {
  email?: string;
  password?: string;
};

type FormErrors = {
  email?: string;
  password?: string;
  general?: string;
};

function LoginForm() {
  const [_location, setLocation] = useLocation();
  const login = trpc.auth.login.useMutation();

  const [errors, setErrors] = useState<FormErrors>({});

  const form = useForm<FormState>({
    onSubmit: async (s) => {
      const { email, password } = s;
      if (!email) return setErrors({ email: "Email is required" });
      if (!password) return setErrors({ password: "Password is required" });
      setErrors({});
      try {
        const { token } = await login.mutateAsync({ email, password });
        useAuth.getState().setToken(token);
        setLocation("/");
      } catch (err: any) {
        setErrors({ general: err?.message || "Something went wrong" });
      }
    },
  });

  return (
    <form className="max-w-sm mt-4" ref={form}>
      <label className="block">
        <span>Email</span>
        <input
          type="email"
          id="email"
          name="email"
          className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-stone-400 focus:ring focus:ring-stone-200 focus:ring-opacity-50"
          placeholder=""
        />
        <span className="text-red-500 text-sm">{errors.email}</span>
      </label>
      <label className="block mt-2">
        <span>Password</span>
        <input
          type="password"
          id="password"
          name="password"
          className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-stone-400 focus:ring focus:ring-stone-200 focus:ring-opacity-50"
          placeholder=""
        />
        <span className="text-red-500 text-sm">{errors.password}</span>
      </label>
      <div className="flex space-x-2 mt-6">
        <Link href="/">
          <a className="button">Cancel</a>
        </Link>
        <button type="submit">Login</button>
      </div>
      <p className="text-red-500 mt-2">{errors.general}</p>
    </form>
  );
}
