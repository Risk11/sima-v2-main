"use client";

import { useState } from "react";

interface PhotoCarouselProps {
    photoStr: string;
}

const PhotoCarousel = ({ photoStr }: PhotoCarouselProps) => {
    const imageUrls = photoStr.split(",").map((u) => u.trim()).filter((u) => u !== "" && u.startsWith("http"));
    const [currentImage, setCurrentImage] = useState(0);

    const handlePrev = () => {
        setCurrentImage((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
    };

    const handleNext = () => {
        setCurrentImage((prev) => (prev + 1) % imageUrls.length);
    };

    if (imageUrls.length === 0) {
        return <p className="italic text-gray-500 text-center text-xs">Tidak ada foto.</p>;
    }

    return (
        <div className="w-full pt-2">
            <h4 className="text-sm font-bold text-gray-700 mb-2">Foto</h4>
            <div className="relative w-full rounded-xl overflow-hidden shadow-sm border border-gray-300">
                <img
                    key={currentImage}
                    src={imageUrls[currentImage]}
                    alt={`Foto ${currentImage + 1}`}
                    className="w-full h-auto max-h-[160px] object-cover bg-gray-100 transition-all duration-300 ease-in-out"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.dataset.fallback) {
                            target.src = "https://via.placeholder.com/250x160/F0F4F8/6B7280?text=Foto+Gagal+Dimuat";
                            target.dataset.fallback = "true";
                        }
                    }}
                />
                {imageUrls.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between p-2">
                        <button
                            onClick={handlePrev}
                            className="bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors shadow-lg"
                            aria-label="Previous image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <button
                            onClick={handleNext}
                            className="bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors shadow-lg"
                            aria-label="Next image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
            {imageUrls.length > 1 && (
                <div className="flex justify-center items-center mt-2 text-xs font-medium text-gray-600">
                    {currentImage + 1} / {imageUrls.length}
                </div>
            )}
        </div>
    );
};

export default PhotoCarousel;