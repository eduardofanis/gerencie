import { FormControl, FormField, FormItem, FormLabel } from "../../ui/form"; // Shadcn UI import
import { Input } from "../../ui/input"; // Shandcn UI Input
import { InputProps } from "@/types/InputProps";

export default function FileInput(props: InputProps) {
  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={() => {
        return (
          <FormItem>
            {props.label && (
              <FormLabel htmlFor={props.name}>{props.label}</FormLabel>
            )}
            <FormControl>
              <Input
                accept="image/png, image/jpeg, image/webp"
                type="file"
                id={props.name}
                {...props.form.register(props.name)}
                className={props.className}
              />
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
}
