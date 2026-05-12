import { useState } from "react";

export default function LazyImage({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        src={src}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-auto transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
