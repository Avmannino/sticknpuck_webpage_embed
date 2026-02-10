import { useState, useEffect } from 'react';

interface HeroCarouselProps {
  images: Array<{ url: string; alt: string }>;
  interval?: number;
}

export function HeroCarousel({ images, interval = 3000 }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden rounded-lg">
      {images.map((image, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(${(index - currentIndex) * 100}%)`,
          }}
        >
          <img
            src={image.url}
            alt={image.alt}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}