import { InputProps } from "@/types/InputProps";
import React, { useReducer } from "react";
import { FormControl, FormField, FormItem, FormLabel } from "../../ui/form"; // Shadcn UI import
import { Input } from "../../ui/input"; // Shandcn UI Input

export default function BirthDateInput(props: InputProps) {
  const initialValue = "";

  function formatDateOfBirth(value: string) {
    const digits = value.replace(/\D/g, "");
    let formattedValue = digits.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
    formattedValue = formattedValue.slice(0, 10);
    return formattedValue;
  }

  const [value, setValue] = useReducer((_: unknown, next: string) => {
    const formattedValue = formatDateOfBirth(next);
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
                  if (ev.target.value.length <= 10) {
                    setValue(ev.target.value);
                    field.onChange(
                      ev.target.value.replace(
                        /(\d{2})(\d{2})(\d{4})/,
                        "$1/$2/$3"
                      )
                    );
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
