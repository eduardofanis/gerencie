import { UseFormReturn } from "react-hook-form";

export type InputProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  type?: "password" | "text";
  placeholder?: string;
  className?: string;
  defaultValue?: string;
};
