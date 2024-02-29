import { useReducer } from "react";
import { FormControl, FormField, FormItem, FormLabel } from "../../ui/form"; // Shadcn UI import
import { Input } from "../../ui/input"; // Shandcn UI Input
import { InputProps } from "@/types/InputProps";
import React from "react";

interface NumberInputProps extends InputProps {
  decimals?: number;
  maxLength?: number;
  maxValue?: number;
}

export default function NumberInput(props: NumberInputProps) {
  const initialValue = "";

  function getDecimals(value: number) {
    let string = "1";
    for (let i = 0; i < value; i++) {
      string += "0";
    }
    return parseFloat(string);
  }

  const multiply = props.decimals ? getDecimals(props.decimals) : 1;

  const [value, setValue] = useReducer((_: unknown, next: string) => {
    const digits = next.replace(/\D/g, "");
    let calculatedValue = Number(digits) / multiply;

    if (props.maxValue && calculatedValue > props.maxValue) {
      calculatedValue = props.maxValue;
    }

    // Formata o valor para adicionar zeros à direita
    const formattedValue = calculatedValue.toFixed(props.decimals || 0);
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
            <FormLabel>{props.label}</FormLabel>
            <FormControl>
              <Input
                placeholder={props.placeholder}
                type="text"
                className=""
                {...field}
                onChange={(ev) => {
                  if (props.maxLength) {
                    if (ev.target.value.length <= props.maxLength) {
                      setValue(ev.target.value);
                      field.onChange(ev.target.value);
                    }
                  } else {
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
