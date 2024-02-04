import React from "react";
import { FormControl, FormField, FormItem, FormLabel } from "../../ui/form"; // Shadcn UI import
import { Input } from "../../ui/input"; // Shandcn UI Input
import { InputProps } from "@/types/InputProps";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function FileInput(props: InputProps) {
  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field }) => {
        const images = props.form.watch(props.name);

        return (
          <FormItem>
            <FormLabel>{props.label}</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  placeholder={props.placeholder}
                  type="file"
                  className={props.className}
                  {...field}
                  onChange={(ev) => {
                    const dataTransfer = new DataTransfer();

                    if (images && images instanceof FileList) {
                      Array.from(images).forEach((image) =>
                        dataTransfer.items.add(image)
                      );
                    }
                    Array.from(ev.target.files!).forEach((image) =>
                      dataTransfer.items.add(image)
                    );

                    const newFiles = dataTransfer.files;
                    field.onChange(newFiles);
                  }}
                />
                {/* {image && (
                  <>
                    <img
                      src={image}
                      className="absolute top-0 left-0 w-full h-full object-cover rounded-md pointer-events-none"
                    />
                    <Button
                      className="absolute top-2 right-2 p-2 h-8"
                      onClick={() => setImage(undefined)}
                      variant={"secondary"}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )} */}
              </div>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
}
