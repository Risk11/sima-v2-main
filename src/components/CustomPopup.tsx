"use client";

import Graphic from "@arcgis/core/Graphic";
import { X } from "lucide-react";

interface CustomPopupProps {
    feature: Graphic | null;
    onClose: () => void;
}

export default function CustomPopup({ feature, onClose }: CustomPopupProps) {
    if (!feature) return null;

    const attrs = feature.attributes || {};
    const layerName = feature.layer?.title || feature.layer?.id || "Unknown Layer";

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-96 max-w-full p-6 relative animate-fade-in">
                {/* Header */}
                <div className="flex justify-between items-center mb-2 border-b border-slate-200 pb-2">
                    <h3 className="font-bold text-lg text-slate-800">{layerName} - Detail Feature</h3>
                    <button
                        onClick={onClose}
                        className="text-red-500 hover:text-red-600 transition-colors"
                        aria-label="Close popup"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Table Atribut */}
                <div className="overflow-y-auto max-h-64">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-slate-100 sticky top-0">
                                <th className="border px-3 py-1 text-left">Atribut</th>
                                <th className="border px-3 py-1 text-left">Nilai</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(attrs).map(([key, value]) => (
                                <tr key={key} className="hover:bg-slate-50">
                                    <td className="border px-3 py-1 font-semibold text-slate-700">{key}</td>
                                    <td className="border px-3 py-1 text-slate-600 truncate">{String(value)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
