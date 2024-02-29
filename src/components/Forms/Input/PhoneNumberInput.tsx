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
    // Formatação do número de telefone
    let formattedValue = digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    // Limita o comprimento do número de telefone
    formattedValue = formattedValue.slice(0, 15);
    return formattedValue;
  }

  const [value, setValue] = useReducer((_: unknown, next: string) => {
    // Formata o valor enquanto o usuário digita
    const formattedValue = formatPhoneNumber(next);
    return formattedValue;
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
                  setValue(ev.target.value);
                  field.onChange(ev.target.value);
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
