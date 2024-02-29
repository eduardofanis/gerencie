import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { SelectItems } from "./SelectInput";
import { InputProps } from "@/types/InputProps";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

interface ComboProps extends InputProps {
  selectItems: SelectItems[];
}

export default function ComboInput(props: ComboProps) {
  React.useEffect(() => {
    if (props.defaultValue) {
      props.form.setValue(props.name, props.defaultValue);
    }
  }, [props]);

  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{props.label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    `w-full justify-between ${props.className}`,
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? props.selectItems.find(
                        (item) => item.value === field.value
                      )?.label
                    : props.placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput
                  placeholder="Digite para procurar..."
                  className="h-9"
                />
                <CommandEmpty>Nada encontrado.</CommandEmpty>
                <CommandGroup>
                  <ScrollArea className="h-[160px]">
                    {props.selectItems.map((item) => (
                      <CommandItem
                        value={item.label}
                        key={item.value}
                        onSelect={() => {
                          props.form.setValue(props.name, item.value);
                        }}
                      >
                        {item.label}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            item.value === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </ScrollArea>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
  );
}
