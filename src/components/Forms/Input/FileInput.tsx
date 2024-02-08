import React from "react";
import { FormControl, FormField, FormItem, FormLabel } from "../../ui/form"; // Shadcn UI import
import { Input } from "../../ui/input"; // Shandcn UI Input
import { CostumerInputProps } from "@/types/CostumerInputProps";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useFormContext } from "react-hook-form";

export default function FileInput(props: CostumerInputProps) {
  const [image, setImage] = React.useState<string | null>(null);
  const { setValue } = useFormContext();

  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel htmlFor={props.name}>{props.label}</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  placeholder={props.placeholder}
                  type="file"
                  id={props.name}
                  {...props.form.register(props.name)}
                  className={props.className}
                  onChange={(ev) => {
                    const file = ev.target.files?.[0];
                    field.onChange(ev.target.files?.[0]);
                    setImage(file ? URL.createObjectURL(file) : null);
                  }}
                />
                {image && (
                  <>
                    <img
                      src={image}
                      className="absolute top-0 left-0 w-full h-full object-cover rounded-md pointer-events-none"
                    />
                    <Button
                      className="absolute top-2 right-2 p-2 h-8"
                      onClick={() => {
                        setImage(null);
                        setValue(props.name, null);
                      }}
                      variant={"secondary"}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
}
