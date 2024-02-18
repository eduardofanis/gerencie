import { FormControl, FormField, FormItem, FormLabel } from "../../ui/form"; // Shadcn UI import
import { Input } from "../../ui/input"; // Shandcn UI Input
import { CostumerInputProps } from "@/types/CostumerInputProps";

export default function FileInput(props: CostumerInputProps) {
  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={() => {
        return (
          <FormItem>
            <FormLabel htmlFor={props.name}>{props.label}</FormLabel>
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
