import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';

interface DataSelectorProps<T> {
    label: string;
    placeholder: string;
    loadingPlaceholder: string;
    value: string;
    onValueChange: (value: string) => void;
    options: T[];
    valueKey: keyof T;
    labelKey: keyof T;
    isLoading?: boolean;
    disabled?: boolean;
    onItemHover?: (value: string) => void;
}

export function DataSelector<T>({
    label,
    placeholder,
    loadingPlaceholder,
    value,
    onValueChange,
    options,
    valueKey,
    labelKey,
    isLoading = false,
    disabled = false,
    onItemHover,
}: DataSelectorProps<T>) {
    return (
        <div>
            <label className="text-xs font-medium text-gray-500">{label}</label>
            <Select
                value={value}
                onValueChange={onValueChange}
                disabled={disabled || isLoading}
            >
                <SelectTrigger className="w-[220px] mt-1">
                    {isLoading ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>{loadingPlaceholder}</span>
                        </div>
                    ) : (
                        <SelectValue placeholder={placeholder} />
                    )}
                </SelectTrigger>
                <SelectContent>
                    {(options ?? []).map((option, index) => {
                        const itemValue = String(option[valueKey]);
                        const itemLabel = String(option[labelKey]);

                        return (
                            <SelectItem
                                key={index}
                                value={itemValue}
                                onMouseEnter={() => onItemHover?.(itemValue)}
                            >
                                {itemLabel}
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
        </div>
    );
}