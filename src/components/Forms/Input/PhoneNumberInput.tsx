import { useReducer } from "react";
import { FormControl, FormField, FormItem, FormLabel } from "../../ui/form"; // Shadcn UI import
import { Input } from "../../ui/input"; // Shandcn UI Input
import { InputProps } from "@/types/InputProps";
import React from "react";

export default function PhoneNumberInput(props: InputProps) {
  const initialValue = "";

  function formatPhoneNumber(value: string) {
    // Remove todos os caracteres não numéricos
    const digits = value.replace(/\D/g, "");

    // Formata o número de acordo com a quantidade de dígitos
    if (digits.length <= 10) {
      return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    } else {
      return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
  }

  const [formattedValue, setFormattedValue] = useReducer(
    (_: unknown, next: string) => {
      if (!next) return initialValue;

      return formatPhoneNumber(next);
    },
    initialValue
  );

  React.useEffect(() => {
    if (props.defaultValue) {
      setFormattedValue(props.defaultValue);
    }
  }, [props.defaultValue]);

  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field }) => {
        field.value = formattedValue;

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
                  if (ev.target.value.length <= 15) {
                    setFormattedValue(ev.target.value);
                    field.onChange(ev.target.value.replace(/\D/g, ""));
                  }
                }}
                value={formattedValue}
              />
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
}
