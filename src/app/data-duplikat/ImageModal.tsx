"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';

const CloseIcon = () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);
const ResizeIcon = () => (
    <svg className="h-3 w-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 20L20 4M4 12L12 4M12 20L20 12" /></svg>
);
export const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

export const MinusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
    </svg>
);

interface FloatingImageViewerProps {
    src: string;
    onClose: () => void;
}

export default function FloatingImageViewer({ src, onClose }: FloatingImageViewerProps) {
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [size, setSize] = useState({ width: 400, height: 300 });
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });
    const viewerRef = useRef<HTMLDivElement>(null);

    const [scale, setScale] = useState(1);
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    const [isImageDragging, setIsImageDragging] = useState(false);
    const lastImagePosition = useRef({ x: 0, y: 0 });
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        setScale(1);
        setImagePosition({ x: 0, y: 0 });
    }, [src]);

    const onDragMouseDown = (e: React.MouseEvent) => {
        if (isResizing) return;
        e.preventDefault();
        setIsDragging(true);
        dragOffset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };
    };

    const onResizeMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
        resizeStart.current = {
            x: e.clientX,
            y: e.clientY,
            width: size.width,
            height: size.height,
        };
    };

    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        setScale(prevScale => {
            const newScale = prevScale * (1 - e.deltaY * 0.001);
            return Math.max(0.1, Math.min(newScale, 5));
        });
    }, []);

    const handleImageMouseDown = useCallback((e: React.MouseEvent) => {
        if (scale > 1) {
            setIsImageDragging(true);
            lastImagePosition.current = { x: e.clientX, y: e.clientY };
        }
    }, [scale]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isDragging) {
            const newX = e.clientX - dragOffset.current.x;
            const newY = e.clientY - dragOffset.current.y;
            setPosition({ x: newX, y: newY });
        }
        if (isResizing) {
            const dx = e.clientX - resizeStart.current.x;
            const dy = e.clientY - resizeStart.current.y;
            const newWidth = Math.max(250, resizeStart.current.width + dx);
            const newHeight = Math.max(200, resizeStart.current.height + dy);
            setSize({ width: newWidth, height: newHeight });
        }
        if (isImageDragging && scale > 1) {
            const dx = e.clientX - lastImagePosition.current.x;
            const dy = e.clientY - lastImagePosition.current.y;
            setImagePosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
            lastImagePosition.current = { x: e.clientX, y: e.clientY };
        }
    }, [isDragging, isResizing, isImageDragging, scale]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setIsResizing(false);
        setIsImageDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging || isResizing || isImageDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, isImageDragging, handleMouseMove, handleMouseUp]);

    return (
        <div
            ref={viewerRef}
            className="fixed bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col border border-slate-300"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: `${size.width}px`,
                height: `${size.height}px`,
                zIndex: 1000,
                userSelect: 'none',
                cursor: isDragging ? 'grabbing' : 'default',
            }}
        >
            <div
                className="h-8 bg-blue-700 text-white flex items-center justify-between px-2 flex-shrink-0"
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                onMouseDown={onDragMouseDown}
            >
                <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold truncate">Image Viewer</span>
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={(e) => { e.stopPropagation(); setScale(prev => Math.min(5, prev + 0.2)); }}
                            className="p-1 rounded hover:bg-slate-600 transition-colors"
                            aria-label="Zoom in"
                        >
                            <PlusIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); setScale(prev => Math.max(0.1, prev - 0.2)); }}
                            className="p-1 rounded hover:bg-slate-600 transition-colors"
                            aria-label="Zoom out"
                        >
                            <MinusIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 rounded hover:bg-red-500 flex items-center justify-center"
                    aria-label="Tutup"
                >
                    <CloseIcon />
                </button>
            </div>

            <div className="flex-1 bg-slate-200 relative overflow-hidden flex items-center justify-center" onWheel={handleWheel}>
                <img
                    ref={imageRef}
                    src={src}
                    alt="Foto Detail"
                    className="max-w-full max-h-full object-contain"
                    style={{
                        transform: `scale(${scale}) translate(${imagePosition.x / scale}px, ${imagePosition.y / scale}px)`,
                        cursor: scale > 1 ? (isImageDragging ? 'grabbing' : 'grab') : 'default',
                        transition: 'transform 75ms ease-out',
                    }}
                    onMouseDown={handleImageMouseDown}
                    draggable="false"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.dataset.fallback) {
                            target.src = "https://placehold.co/800x600/E2E8F0/4A5568?text=Foto+Gagal+Dimuat";
                            target.dataset.fallback = "true";
                        }
                    }}
                />
            </div>

            <div
                className="absolute bottom-0 right-0 w-4 h-4 flex items-center justify-center"
                style={{ cursor: 'se-resize' }}
                onMouseDown={onResizeMouseDown}
            >
                <ResizeIcon />
            </div>
        </div>
    );
}