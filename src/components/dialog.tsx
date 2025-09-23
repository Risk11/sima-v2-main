import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LucideIcon } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

export interface Field {
  id: string;
  label: string;
  placeholder?: string;
  isTag?: boolean;
  type?: "select" | "text" | "number";
  options?: { id: string | number; label?: string; nama_up3?: string; value?: string | number }[];
}

interface DialogProps<T extends Record<string, any> = Record<string, any>> {
  title: string;
  description?: string;
  button?: string;
  fields?: Field[];
  children?: (handleClose: () => void) => ReactNode;
  icon?: LucideIcon;
  label?: string;
  onOpen?: () => void;
  onClose?: () => void;
  buttonColor?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (formData: T) => void;
  initialData?: Partial<T>;
}

function DialogDemo<T extends Record<string, any> = Record<string, any>>({
  title,
  description,
  button,
  fields = [],
  children,
  icon: Icon,
  label,
  onOpen,
  onClose,
  buttonColor,
  open,
  onOpenChange,
  onSubmit,
  initialData = {},
}: DialogProps<T>) {
  const [formData, setFormData] = useState<T>({} as T);

  const isControlled = open !== undefined && onOpenChange !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = isControlled ? open : internalOpen;

  const setOpen = (val: boolean) => {
    if (isControlled) {
      onOpenChange?.(val);
    } else {
      setInternalOpen(val);
    }
    if (val && onOpen) onOpen();
    if (!val && onClose) onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({ ...prev, ...initialData } as T));
    }
  }, [isOpen, initialData]);

  const handleChange = (id: string, value: any) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData);
      setOpen(false);
      setFormData({} as T);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {button && (
        <DialogTrigger asChild>
          <Button
            onClick={() => setOpen(true)}
            variant="outline"
            className={`flex items-center gap-2 flex-wrap px-3 py-2 ${buttonColor || "bg-sky-500 text-white hover:scale-95"}`}
          >
            {Icon && <Icon className="w-5 h-5" />}
            <span>{label || button}</span>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px] max-w-full">
        <DialogHeader>
          <DialogTitle className="text-center md:text-left">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-center md:text-left">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {fields.map((field) => (
            <div
              key={field.id}
              className="grid grid-cols-1 md:grid-cols-4 items-center gap-4"
            >
              <Label htmlFor={field.id} className="text-left md:text-right">
                {field.label}
              </Label>
              {field.type === "select" && field.options ? (
                <select
                  id={field.id}
                  value={formData[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="md:col-span-3 col-span-1 border rounded px-2 py-1"
                >
                  <option value="">-- Pilih --</option>
                  {field.options.map((opt) => (
                    <option key={opt.id} value={opt.value?.toString() ?? opt.id}>
                      {opt.nama_up3 || opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id={field.id}
                  placeholder={field.placeholder}
                  value={formData[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="md:col-span-3 col-span-1"
                />
              )}
            </div>
          ))}
          {typeof children === "function" ? children(() => setOpen(false)) : children}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} className="w-full">
            {button || "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DialogDemo;