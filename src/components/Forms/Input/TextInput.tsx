import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputProps } from "@/types/InputProps";

export default function TextInput(props: InputProps) {
  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field }) => (
        <FormItem>
          {props.label && <FormLabel>{props.label}</FormLabel>}
          <FormControl>
            <Input
              placeholder={props.placeholder}
              className={props.className}
              type={props.type || "text"}
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
