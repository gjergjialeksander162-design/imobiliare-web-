export interface FormState {
  status: "idle" | "error";
  message: string;
}

export const initialFormState: FormState = { status: "idle", message: "" };
