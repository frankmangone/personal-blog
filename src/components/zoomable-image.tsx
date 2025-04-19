"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface ZoomableImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  caption?: string;
}

export function ZoomableImage({
  src,
  alt,
  width = 1000,
  height = 1000,
  className = "",
  caption,
}: ZoomableImageProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  // Prevent scrolling when zoomed
  useEffect(() => {
    if (isZoomed) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isZoomed]);

  // Close zoom on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isZoomed) {
        setIsZoomed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomed]);

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const isZoomable = caption?.toLowerCase().includes("[zoom]");
  // Remove the [zoom] marker from the displayed caption
  const displayCaption = caption?.replace(/\[zoom\]/gi, "").trim();

  return (
    <>
      <figure className="w-full my-6">
        <div
          className={`relative ${
            isZoomable ? "cursor-zoom-in" : ""
          } ${className}`}
          onClick={isZoomable ? toggleZoom : undefined}
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="rounded-lg w-full"
          />
          {isZoomable && (
            <div className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-md text-xs px-2">
              Click to zoom
            </div>
          )}
        </div>
        {displayCaption && (
          <figcaption className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
            {displayCaption}
          </figcaption>
        )}
      </figure>

      {isZoomed && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center cursor-zoom-out"
          onClick={toggleZoom}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 z-10"
              onClick={toggleZoom}
              aria-label="Close zoom"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <Image
              src={src}
              alt={alt}
              width={2000}
              height={2000}
              className="max-h-[90vh] object-contain"
            />
          </div>
          <div className="absolute bottom-4 left-0 right-0 text-center text-white">
            <p className="text-sm">ESC or click to close</p>
          </div>
        </div>
      )}
    </>
  );
}
