import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
}

export const KpiCard = ({ title, value, icon: Icon }: KpiCardProps) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
            <Icon className="w-8 h-8 text-blue-500 mr-4" />
            <div>
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-gray-500">{title}</div>
            </div>
        </div>
    );
}