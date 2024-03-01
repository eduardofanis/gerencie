import { useReducer } from "react";
import { FormControl, FormField, FormItem, FormLabel } from "../../ui/form"; // Shadcn UI import
import { Input } from "../../ui/input"; // Shandcn UI Input
import { InputProps } from "@/types/InputProps";
import React from "react";

export default function NumberInput(props: InputProps) {
  const initialValue = props.form.getValues()[props.name] || "";

  const [value, setValue] = useReducer((_: unknown, next: string) => {
    const digits = next.replace(/\D/g, "");
    return digits;
  }, initialValue);

  function handleChange(
    realChangeFn: (...event: unknown[]) => void,
    formattedValue: string
  ) {
    const digits = formattedValue.replace(/\D/g, "");
    const realValue = Number(digits);
    realChangeFn(realValue);
  }

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
        const _change = field.onChange;

        return (
          <FormItem>
            {props.label && <FormLabel>{props.label}</FormLabel>}
            <FormControl>
              <Input
                placeholder={props.placeholder}
                type="text"
                {...field}
                onChange={(ev) => {
                  setValue(ev.target.value);
                  handleChange(_change, ev.target.value);
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
