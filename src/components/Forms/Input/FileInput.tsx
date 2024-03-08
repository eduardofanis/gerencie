import { FormControl, FormField, FormItem, FormLabel } from "../../ui/form"; // Shadcn UI import
import { Input } from "../../ui/input"; // Shandcn UI Input
import { InputProps } from "@/types/InputProps";

interface FileInputProps extends InputProps {
  multiple?: boolean;
}

export default function FileInput(props: FileInputProps) {
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
                accept="image/png, image/jpeg, image/jpg, image/webp, application/pdf"
                type="file"
                multiple={props.multiple}
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
