import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";
import { ReactNode, useState, useEffect } from "react";

export interface Field {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  optional?: boolean;
  required?: boolean;
  options?: { id: number | string; label: string }[];
}

interface SheetProps {
  fields?: Field[];
  button: string;
  title: string;
  description?: string;
  children?: ReactNode;
  onSubmit?: (formData: Record<string, any>) => Promise<any>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialData?: Record<string, any>;
}

const SheetDemo: React.FC<SheetProps> = ({
  fields = [],
  button,
  title,
  description,
  children,
  onSubmit,
  open: controlledOpen,
  onOpenChange,
  initialData,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  useEffect(() => {
    if (isOpen) {
      const initialValues: Record<string, any> = {};
      fields.forEach((field) => {
        if (field.type === "file") {
          initialValues[field.id] = null;
        } else {
          initialValues[field.id] = initialData?.[field.id] ?? "";
        }
      });
      setFormValues(initialValues);
    }
  }, [isOpen, initialData, fields]);

  const handleChange = (id: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else {
      setInternalOpen(open);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmit) return;

    setIsSubmitting(true);

    const submissionValues = { ...formValues };
    fields.forEach(field => {
      if (field.type === 'file' && !(submissionValues[field.id] instanceof FileList)) {
        delete submissionValues[field.id];
      }
    });

    try {
      await onSubmit(submissionValues);
      handleOpenChange(false);
    } catch (error) {
      console.error("Submit Gagal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      {!controlledOpen && (
        <SheetTrigger asChild>
          <Button className="bg-blue-950 hover:bg-slate-100 hover:text-black hover:scale-95">
            {button}
          </Button>
        </SheetTrigger>
      )}
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4" encType="multipart/form-data">
          {fields.map((field) => (
            <div key={field.id} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.id} className="text-left col-span-1">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <div className="col-span-3">
                {field.type === "select" ? (
                  <select
                    id={field.id}
                    name={field.id}
                    value={formValues[field.id] || ""}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    className="w-full border rounded px-2 py-1.5 bg-transparent"
                    disabled={isSubmitting}
                    required={field.required}
                  >
                    <option value="" disabled>
                      -- Pilih --
                    </option>
                    {field.options?.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "file" ? (
                  <Input
                    id={field.id}
                    name={field.id}
                    type="file"
                    accept="image/*"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChange(field.id, e.target.files && e.target.files.length > 0 ? e.target.files : null)
                    }
                    className="col-span-3"
                    disabled={isSubmitting}
                    required={field.required}
                  />
                ) : (
                  <Input
                    id={field.id}
                    name={field.id}
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    value={formValues[field.id] || ""}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    className="col-span-3"
                    disabled={isSubmitting}
                    required={field.required}
                  />
                )}
              </div>
            </div>
          ))}
          {children}
          <SheetFooter className="mt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-[#24548B] hover:bg-[#2D5C90]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan"
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default SheetDemo;
