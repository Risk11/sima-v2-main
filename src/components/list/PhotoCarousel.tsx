"use client";

import { useState, useCallback } from "react";
import { ChevronLeftIcon, ChevronRightIcon, ZoomInIcon } from "../ui/icons";
import FloatingImageViewer from "./ImageModal";

interface PhotoCarouselProps {
    imageUrls: string[];
}

export default function PhotoCarousel({ imageUrls }: PhotoCarouselProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    const handlePrev = useCallback(() => {
        setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
    }, [imageUrls.length]);

    const handleNext = useCallback(() => {
        setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
    }, [imageUrls.length]);

    const openViewer = useCallback(() => setIsViewerOpen(true), []);
    const closeViewer = useCallback(() => setIsViewerOpen(false), []);

    if (imageUrls.length === 0) {
        return null;
    }

    const currentImageSrc = imageUrls[currentImageIndex];

    return (
        <div className="w-full pt-2">
            <h4 className="text-sm font-semibold text-gray-500 mb-2">Foto</h4>
            <div className="relative w-full rounded-xl overflow-hidden shadow-sm border border-slate-300 group">
                <img
                    key={currentImageIndex}
                    src={currentImageSrc}
                    alt={`Foto ${currentImageIndex + 1}`}
                    className="w-full h-auto max-h-[180px] object-cover bg-gray-200"
                />

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-between px-2">
                    {imageUrls.length > 1 ? (
                        <button
                            onClick={handlePrev}
                            className="bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors focus:outline-none opacity-0 group-hover:opacity-100"
                            aria-label="Previous image"
                        >
                            <ChevronLeftIcon />
                        </button>
                    ) : <div />}

                    <button
                        onClick={openViewer}
                        className="bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors focus:outline-none opacity-0 group-hover:opacity-100"
                        aria-label="Buka di Jendela"
                    >
                        <ZoomInIcon />
                    </button>

                    {imageUrls.length > 1 ? (
                        <button
                            onClick={handleNext}
                            className="bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors focus:outline-none opacity-0 group-hover:opacity-100"
                            aria-label="Next image"
                        >
                            <ChevronRightIcon />
                        </button>
                    ) : <div />}
                </div>

                {imageUrls.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-gray-800/60 text-white text-xs font-medium px-2 py-1 rounded-full">
                        <span>{currentImageIndex + 1} / {imageUrls.length}</span>
                    </div>
                )}
            </div>

            {isViewerOpen && <FloatingImageViewer src={currentImageSrc} onClose={closeViewer} />}
        </div>
    );
}