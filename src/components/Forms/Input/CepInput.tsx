import { useReducer } from "react";
import { FormControl, FormField, FormItem, FormLabel } from "../../ui/form"; // Shadcn UI import
import { Input } from "../../ui/input"; // Shandcn UI Input
import { InputProps } from "@/types/InputProps";
import { fetchCep } from "@/api";

export default function CepInput(props: InputProps) {
  const initialValue = "";

  function formatCEP(value: string) {
    const digits = value.replace(/\D/g, "");
    let formattedValue = digits.replace(/(\d{5})(\d{3})/, "$1-$2");
    formattedValue = formattedValue.slice(0, 9);
    return formattedValue;
  }

  const [value, setValue] = useReducer((_: unknown, next: string) => {
    const formattedValue = formatCEP(next);
    return formattedValue;
  }, initialValue);

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
                  setValue(ev.target.value);
                  field.onChange(ev.target.value);
                  if (ev.target.value.length == 8) {
                    fetchCep(ev.target.value.replace("-", ""), props.form);
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
