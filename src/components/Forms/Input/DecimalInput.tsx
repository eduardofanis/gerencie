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

export default function DecimalInput(props: NumberInputProps) {
  const numberFormatter = Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: props.decimals,
    maximumFractionDigits: props.decimals,
  });

  const initialValue = props.form.getValues()[props.name]
    ? numberFormatter.format(Number(props.form.getValues()[props.name]))
    : "";

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
    return numberFormatter.format(Number(digits) / multiply);
  }, initialValue);

  function handleChange(
    realChangeFn: (...event: unknown[]) => void,
    formattedValue: string
  ) {
    const digits = formattedValue.replace(/\D/g, "");
    const realValue = Number(digits) / multiply;
    realChangeFn(realValue);
  }

  React.useEffect(() => {
    const numberFormatter = Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: props.decimals,
      maximumFractionDigits: props.decimals,
    });

    if (props.defaultValue) {
      const formattedDefaultValue = numberFormatter.format(
        Number(props.defaultValue)
      );
      setValue(formattedDefaultValue);
    }
  }, [props.defaultValue, props.decimals]);

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
                  if (props.maxLength) {
                    if (ev.target.value.length < props.maxLength) {
                      setValue(ev.target.value);
                      handleChange(_change, ev.target.value);
                    }
                  } else {
                    setValue(ev.target.value);
                    handleChange(_change, ev.target.value);
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
