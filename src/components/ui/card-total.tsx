import { LucideIcon } from "lucide-react";

interface CardProps {
  total: string;
  textColor?: string;
  description: string;
  className?: string;
  icon?: LucideIcon; 
  iconColor? : string;
}

const CardTotal: React.FC<CardProps> = ({
  total,
  description,
  textColor,
  className,
  icon: Icon, 
  iconColor
}) => {
  return (
    <div className={`bg-white text-left rounded-lg border border-2 border-sky-300 mt-1 p-2 ${className}`}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className={`w-5 h-5 ${iconColor}`} />} {/* ikon opsional */}
        <p className={`font-semibold text-md ${textColor ?? "text-[#383737]"} font-poppins`}>
          {total}
        </p>
      </div>
      <p className="text-xs font-light mt-1 font-poppins">{description}</p>
    </div>
  );
};

export default CardTotal;
