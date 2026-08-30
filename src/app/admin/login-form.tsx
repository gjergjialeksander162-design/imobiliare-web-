"use client";

import { useActionState } from "react";

import { loginAction } from "@/app/admin/actions";
import { initialFormState } from "@/app/admin/form-state";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialFormState);

  return (
    <form action={action} className="card mx-auto max-w-sm space-y-4 p-6">
      <div>
        <h1 className="text-lg font-bold">Panel administrimi</h1>
        <p className="mt-1 text-sm text-slate-600">
          Kyçuni për të menaxhuar listimet dhe kërkesat.
        </p>
      </div>

      <div>
        <label className="label" htmlFor="password">
          Fjalëkalimi
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="field"
        />
      </div>

      {state.status === "error" && (
        <p role="alert" className="text-sm font-medium text-rose-600">
          {state.message}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Po kyçet…" : "Kyçu"}
      </button>
    </form>
  );
}
