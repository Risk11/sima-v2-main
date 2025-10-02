"use client";
import Graphic from "@arcgis/core/Graphic";
import DuplicateCard from "./DuplicateCard";
import { SpinnerIcon } from "@/components/ui/icons";
import { useState } from "react";

export interface DuplicateGroup {
    idpel: string;
    features: Graphic[];
    count: number;
}

interface DuplicateListProps {
    duplicates: DuplicateGroup[];
    loading: boolean;
    error: string | null;
    onSelect: (idpel: string | null, features: Graphic[] | null) => void;
    onSave: (objectId: number, updatedAttributes: any) => Promise<boolean>;
    onFeatureClick: (feature: Graphic) => void;
    activeFeatureId: number | null;
}

export default function DuplicateList({
    duplicates,
    loading,
    error,
    onSelect,
    onSave,
    onFeatureClick,
    activeFeatureId,
}: DuplicateListProps) {
    const [expandedIdpel, setExpandedIdpel] = useState<string | null>(null);

    const handleToggleExpand = (idpel: string, features: Graphic[]) => {
        const newExpandedIdpel = expandedIdpel === idpel ? null : idpel;
        setExpandedIdpel(newExpandedIdpel);
        onSelect(newExpandedIdpel, newExpandedIdpel ? features : null);
    };

    const StatusDisplay = ({ icon, message }: { icon: React.ReactNode; message: string }) => (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 px-4">
            <div className="text-4xl mb-3">{icon}</div>
            <p className="text-sm">{message}</p>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-slate-100 text-gray-800">
            <div className="p-4 border-b border-slate-200">
                <h1 className="text-xl font-bold text-gray-800">Data Pelanggan Duplikat</h1>
                <p className="text-sm text-gray-500">Ditemukan pada Layer Pelanggan</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {loading && <StatusDisplay icon={<SpinnerIcon />} message="Mencari data duplikat..." />}
                {error && <StatusDisplay icon="❌" message={error} />}
                {!loading && !error && duplicates.length === 0 && (
                    <StatusDisplay icon="✅" message="Tidak ada IDPEL duplikat yang ditemukan." />
                )}

                {!loading && !error && duplicates.map((group) => (
                    <DuplicateCard
                        key={group.idpel}
                        idpel={group.idpel}
                        features={group.features}
                        isExpanded={expandedIdpel === group.idpel}
                        onClick={() => handleToggleExpand(group.idpel, group.features)}
                        onSave={onSave}
                        onFeatureClick={onFeatureClick}
                        activeFeatureId={activeFeatureId}
                    />
                ))}
            </div>

            {!loading && !error && (
                <div className="p-3 text-center text-xs text-gray-500 border-t border-slate-200 bg-white">
                    Total <strong>{duplicates.length}</strong> IDPEL yang terduplikasi
                </div>
            )}
        </div>
    );
}

