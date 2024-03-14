import { useReducer } from "react";
import { FormControl, FormField, FormItem, FormLabel } from "../../ui/form"; // Shadcn UI import
import { Input } from "../../ui/input"; // Shandcn UI Input
import { InputProps } from "@/types/InputProps";
import React from "react";

export default function RGInput(props: InputProps) {
  const initialValue = "";

  function formatCPF(value: string) {
    const digits = value.replace(/\D/g, "");
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, "$1.$2.$3-$4");
  }

  const [value, setValue] = useReducer((_: unknown, next: string) => {
    if (!next) return initialValue;
    return formatCPF(next);
  }, initialValue);

  React.useEffect(() => {
    if (props.defaultValue) {
      setValue(props.defaultValue);
    }
  }, [props.defaultValue]);

  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field }) => {
        field.value = value;

        return (
          <FormItem>
            {props.label && <FormLabel>{props.label}</FormLabel>}
            <FormControl>
              <Input
                placeholder={props.placeholder}
                type="text"
                className={props.className}
                {...field}
                onChange={(ev) => {
                  if (ev.target.value.length <= 12) {
                    setValue(ev.target.value);
                    field.onChange(ev.target.value);
                  }
                }}
                value={value}
              />
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
}
