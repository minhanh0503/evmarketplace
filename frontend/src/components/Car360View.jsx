import { useState, useRef } from "react";

export default function Car360View({ images = [] }) {
  const [current, setCurrent] = useState(0);

  const startX = useRef(0);

  const BASE_URL = "http://localhost:8080";
  if (!images.length) {
    return <div className="text-gray-400">No 360 images available</div>;
  }

  const handleMouseDown = (e) => {
    startX.current = e.clientX;

    const handleMove = (event) => {
      const diff = event.clientX - startX.current;

      if (Math.abs(diff) > 15) {
        if (diff > 0) {
          setCurrent((prev) => (prev - 1 + images.length) % images.length);
        } else {
          setCurrent((prev) => (prev + 1) % images.length);
        }

        startX.current = event.clientX;
      }
    };

    const handleUp = () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    const diff = e.touches[0].clientX - startX.current;

    if (Math.abs(diff) > 15) {
      if (diff > 0) {
        setCurrent((prev) => (prev - 1 + images.length) % images.length);
      } else {
        setCurrent((prev) => (prev + 1) % images.length);
      }

      startX.current = e.touches[0].clientX;
    }
  };

  return (
    <div
      className="w-full h-full cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <img
        src={images[current]}
        alt="360° Car"
        draggable={false}
        className="w-full h-full object-cover"
      />

      <p className="text-center text-sm text-gray-500 mt-2">
        Drag left or right to rotate
      </p>
    </div>
  );
}
