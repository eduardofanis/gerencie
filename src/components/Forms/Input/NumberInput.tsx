import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputProps } from "@/types/InputProps";

export default function NumberInput(props: InputProps) {
  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>{props.label}</FormLabel>
            <FormControl>
              <Input
                placeholder={props.placeholder}
                className={props.className}
                value={field.value!.toString()}
                {...props.form.register(props.name, { maxLength: 3 })}
                onInput={(e) => {
                  props.form.setValue(props.name, e.currentTarget.value);
                }}
                ref={(el) => {
                  field.ref(el);
                }}
                onBlur={field.onBlur}
                name={field.name}
                disabled={field.disabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
