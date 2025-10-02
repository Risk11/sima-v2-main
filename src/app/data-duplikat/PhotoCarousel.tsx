"use client";

import { useState, useCallback } from "react";
import { ChevronRightIcon, ZoomInIcon } from "@/components/ui/icons";
import FloatingImageViewer from "./ImageModal";

const ImageErrorFallback = () => (
    <div className="w-full h-[180px] bg-slate-200 flex items-center justify-center text-center text-slate-500 text-sm p-4">
        <p>Gagal memuat gambar 😟</p>
    </div>
);

interface PhotoCarouselProps {
    imageUrls: string[];
}

export const ChevronLeftIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={className}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);
export default function PhotoCarousel({ imageUrls }: PhotoCarouselProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [hasError, setHasError] = useState(false);

    const hasMultipleImages = imageUrls.length > 1;

    const goToPrev = useCallback(() => {
        setHasError(false);
        setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
    }, [imageUrls.length]);

    const goToNext = useCallback(() => {
        setHasError(false);
        setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
    }, [imageUrls.length]);

    const openViewer = useCallback(() => setIsViewerOpen(true), []);
    const closeViewer = useCallback(() => setIsViewerOpen(false), []);

    if (!imageUrls || imageUrls.length === 0) {
        return <p className="italic text-gray-600 text-center text-sm mt-2">Tidak ada foto tersedia.</p>;
    }

    const currentImageSrc = imageUrls[currentImageIndex];

    return (
        <div className="w-full pt-2">
            <h4 className="text-sm font-semibold text-gray-500 mb-2">Foto</h4>
            <div className="relative w-full rounded-xl overflow-hidden shadow-sm border border-slate-300 group">
                {hasError ? (
                    <ImageErrorFallback />
                ) : (
                    <img
                        key={currentImageSrc}
                        src={currentImageSrc}
                        alt={`Foto ${currentImageIndex + 1} dari ${imageUrls.length}`}
                        className="w-full h-[180px] object-cover bg-gray-200"
                        onError={() => setHasError(true)}
                        onClick={openViewer}
                        style={{ cursor: "zoom-in" }}
                    />
                )}

                <div
                    className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-opacity duration-300 flex items-center justify-between"
                    aria-hidden="true"
                >
                    {hasMultipleImages && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                                className="p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
                                aria-label="Gambar sebelumnya"
                            >
                                <div className="h-6 w-6 drop-shadow-lg">
                                    <ChevronLeftIcon />
                                </div>
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                                className="p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
                                aria-label="Gambar berikutnya"
                            >
                                <div className="h-6 w-6 drop-shadow-lg">
                                    <ChevronRightIcon />
                                </div>
                            </button>
                        </>
                    )}
                </div>

                <button
                    onClick={(e) => { e.stopPropagation(); openViewer(); }}
                    className="absolute top-2 right-2 bg-black/40 text-white p-1.5 rounded-full hover:bg-black/60 transition-colors focus:outline-none opacity-0 group-hover:opacity-100"
                    aria-label="Perbesar foto"
                >
                    <ZoomInIcon />
                </button>

                {hasMultipleImages && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-gray-800/60 text-white text-xs font-medium px-2 py-1 rounded-full">
                        <span>{currentImageIndex + 1} / {imageUrls.length}</span>
                    </div>
                )}
            </div>

            {isViewerOpen && <FloatingImageViewer src={currentImageSrc} onClose={closeViewer} />}
        </div>
    );
}