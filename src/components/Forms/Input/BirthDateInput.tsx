import { useReducer } from "react";
import { FormControl, FormField, FormItem, FormLabel } from "../../ui/form"; // Shadcn UI import
import { Input } from "../../ui/input"; // Shandcn UI Input
import { InputProps } from "@/types/InputProps";
import React from "react";

export default function BirthDateInput(props: InputProps) {
  const initialValue = "";

  function formatDateOfBirth(value: string) {
    // Remove todos os caracteres não numéricos
    const digits = value.replace(/\D/g, "");
    // Aplica a formatação da data de nascimento
    let formattedValue = digits.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
    // Limita o comprimento da data de nascimento
    formattedValue = formattedValue.slice(0, 10);
    return formattedValue;
  }

  const [value, setValue] = useReducer((_: unknown, next: string) => {
    // Formata o valor enquanto o usuário digita
    const formattedValue = formatDateOfBirth(next);
    return formattedValue;
  }, initialValue);

  React.useEffect(() => {
    if (props.defaultValue) {
      setValue(props.defaultValue.replace("/", ""));
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
            <FormLabel>{props.label}</FormLabel>
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
