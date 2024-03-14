import { useReducer } from "react";
import { FormControl, FormField, FormItem, FormLabel } from "../../ui/form"; // Shadcn UI import
import { Input } from "../../ui/input"; // Shandcn UI Input
import { InputProps } from "@/types/InputProps";
import { fetchCep } from "@/services/api";
import React from "react";

export default function CepInput(props: InputProps) {
  const initialValue = "";

  function formatCEP(value: string) {
    const digits = value.replace(/\D/g, "");
    return digits.replace(/(\d{5})(\d{3})/, "$1-$2");
  }

  const [value, setValue] = useReducer((_: unknown, next: string) => {
    if (!next) return initialValue;
    return formatCEP(next);
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
                className=""
                {...field}
                onChange={(ev) => {
                  if (ev.target.value.length <= 9) {
                    setValue(ev.target.value);
                    field.onChange(ev.target.value);
                    if (ev.target.value.length == 8) {
                      fetchCep(ev.target.value.replace("-", ""), props.form);
                    }
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
