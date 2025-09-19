import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { FieldValues } from "react-hook-form";
import { BaseForm } from "@/types/form.ts";
import { cn } from "@/lib/utils.ts";
import { HTMLInputTypeAttribute } from "react";
import { Textarea } from "./textarea";

export default function FormInput<TForm extends FieldValues>({
  type,
  label,
  name,
  placeholder,
  form,
  className,  
  min,
  max,
  required,
  disabled,
  defaultValue,
}: BaseForm<TForm> & {
  type: HTMLInputTypeAttribute;
  min?: number;
  max?: number;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string | number;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { value, onChange, ...restField } }) => {
        return (
          <FormItem className={cn(className, "relative")}>
            <FormLabel className={cn(required && "req")}>{label}</FormLabel>
            <FormControl>
              {type === "textarea" ? (
                <Textarea
                  {...restField}
                  placeholder={placeholder}
                  value={value || ""}
                  onChange={(e) => onChange(e.target.value)}
                  disabled={disabled}
                  defaultValue={defaultValue}
                />
              ) : (
                <Input
                  {...restField}
                  type={type}
                  placeholder={placeholder}
                  value={
                    !value
                      ? ""
                      : type === "date"
                      ? new Date(value).toISOString().split("T")[0]
                      : type === "time"
                      ? value.split(":").slice(0, 2).join(":")
                      : value
                  }
                  min={min}
                  max={max}
                  onChange={(e) => {
                    if (type === "date") {
                      const dateValue = e.target.value ? new Date(e.target.value) : null
                      onChange(dateValue)
                    } else if (type === "number") {
                      const raw = e.target.value
                      const parsed = raw === "" ? "" : Number(raw)
                      onChange(parsed)
                    } else {
                      onChange(e.target.value)
                    }
                  }}
                  disabled={disabled}
                  defaultValue={defaultValue}
                />
              )}
            </FormControl>

            {type === "number" && value && (
              <p className="text-sm text-muted-foreground mt-1">
                {new Intl.NumberFormat("id-ID").format(Number(value))}
              </p>
            )}

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
