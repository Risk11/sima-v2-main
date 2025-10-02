"use client";

import { useMemo } from 'react';
import { FeatureItem, LayerConfig } from "../../types";
import { ChevronDownIcon, ChevronUpIcon } from "../ui/icons";
import PhotoCarousel from "./PhotoCarousel";

interface FeatureCardProps {
    feature: FeatureItem;
    cfg?: LayerConfig;
    isExpanded: boolean;
    isSelected: boolean;
    onClick: () => void;
    cardRef: (el: HTMLDivElement | null) => void;
}

const AttributeValue = ({ field, value }: { field: string, value: any }) => {
    if (typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))) {
        return (
            <a href={value} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline break-all">
                Lihat Tautan
            </a>
        );
    }

    const isDateField = /tgl|tanggal|date/i.test(field);
    if (isDateField && typeof value === 'number' && value > 1000000) {
        return <span>{new Date(value).toLocaleDateString('id-ID')}</span>;
    }

    return <span className="text-gray-800 text-right w-3/5 break-words ml-2">{String(value)}</span>;
};

const isImageFileUrl = (url: string): boolean => {
    return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url);
};

export default function FeatureCard({ feature, cfg, isExpanded, isSelected, onClick, cardRef }: FeatureCardProps) {
    const defaultName = `Feature ${feature.id}`;
    const cardClasses = `mb-3 bg-white border rounded-lg shadow-sm transition-all duration-300 overflow-hidden ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-200'}`;
    const headerClasses = `flex items-center justify-between p-4 cursor-pointer ${isSelected ? 'bg-indigo-50' : 'bg-slate-50'} hover:bg-slate-100 transition-colors duration-200`;
    const toggleIcon = isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />;

    const allImageUrls = useMemo(() => {
        const urls: string[] = [];
        const objectId = feature.graphic.attributes.OBJECTID;
        const serverUrl = cfg?.url ? cfg.url.substring(0, cfg.url.lastIndexOf('/')) : null;

        if (cfg?.photoField && feature.graphic.attributes[cfg.photoField]) {
            const photoUrlString = String(feature.graphic.attributes[cfg.photoField]);
            photoUrlString.split(',').forEach(urlPart => {
                const trimmedUrl = urlPart.trim();
                if (trimmedUrl) {
                    if (trimmedUrl.startsWith('http')) {
                        urls.push(trimmedUrl);
                    } else if (serverUrl) {
                        urls.push(`${serverUrl}/${objectId}/attachments/${trimmedUrl}`);
                    }
                }
            });
        }

        const processedImageFields = new Set<string>();
        if (cfg?.photoField) {
            processedImageFields.add(cfg.photoField);
        }

        for (const fieldName in feature.graphic.attributes) {
            if (processedImageFields.has(fieldName) || fieldName === cfg?.nameField || fieldName === 'OBJECTID') {
                continue;
            }

            const value = feature.graphic.attributes[fieldName];
            if (typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://')) && isImageFileUrl(value)) {
                urls.push(value);
                processedImageFields.add(fieldName);
            }
        }

        return Array.from(new Set(urls)).filter(Boolean);
    }, [feature.graphic.attributes, cfg?.photoField, cfg?.nameField, cfg?.url]);


    const fieldsToDisplayInTable = useMemo(() => {
        if (!cfg?.displayFields) return [];

        const filteredFields = new Set<string>();
        const photoFieldsHandled = new Set<string>();

        if (cfg?.photoField) {
            photoFieldsHandled.add(cfg.photoField);
        }

        for (const fieldName in feature.graphic.attributes) {
            const value = feature.graphic.attributes[fieldName];
            if (typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://')) && isImageFileUrl(value)) {
                photoFieldsHandled.add(fieldName);
            }
        }

        for (const field of cfg.displayFields) {
            if (!photoFieldsHandled.has(field) && field !== cfg.nameField) {
                filteredFields.add(field);
            }
        }

        return Array.from(filteredFields);
    }, [cfg?.displayFields, cfg?.photoField, cfg?.nameField, feature.graphic.attributes]);


    return (
        <div ref={cardRef} className={cardClasses}>
            <div className={headerClasses} onClick={onClick}>
                <h3 className="text-sm font-semibold text-gray-800 truncate pr-2">{feature.name || defaultName}</h3>
                <div className="text-gray-500 flex-shrink-0">{toggleIcon}</div>
            </div>

            {isExpanded && (
                <div className="p-4 border-t border-slate-200 bg-white">
                    {allImageUrls.length > 0 && (
                        <div className="mb-4">
                            <PhotoCarousel imageUrls={allImageUrls} />
                        </div>
                    )}

                    <div className="border border-slate-200 rounded-md overflow-hidden">
                        {fieldsToDisplayInTable.map((field, index) => {
                            const value = feature.graphic.attributes[field];

                            if (value === undefined || value === null || String(value).trim() === '') {
                                return null;
                            }

                            return (
                                <div
                                    key={field}
                                    className={`flex justify-between items-start px-3 py-2 text-xs ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                                >
                                    <span className="font-medium text-gray-500 capitalize w-2/5 break-words">
                                        {field.replace(/_/g, ' ')}
                                    </span>
                                    <AttributeValue field={field} value={value} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}