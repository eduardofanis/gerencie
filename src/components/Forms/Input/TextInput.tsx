import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CostumerInputProps } from "@/types/CostumerInputProps";

export default function TextInput(props: CostumerInputProps) {
  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{props.label}</FormLabel>
          <FormControl>
            <Input
              placeholder={props.placeholder}
              className={props.className}
              onChange={field.onChange}
              value={
                field.value && typeof field.value === "string"
                  ? field.value
                  : ""
              }
              ref={field.ref}
              onBlur={field.onBlur}
              name={field.name}
              disabled={field.disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
