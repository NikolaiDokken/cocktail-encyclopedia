import Image from "next/image";
import clsx from "clsx";

// A drink's picture in a square frame, or a quiet glass outline when it has
// none yet, so lists keep the same rhythm whether or not pictures exist.
// The frame's size comes from `className`; `sizes` tells Next.js how large
// the image is drawn so it serves a fitting resolution.
export default function DrinkImage({
  src,
  alt = "",
  sizes,
  priority = false,
  className,
}: {
  src: string | null;
  alt?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "relative aspect-square shrink-0 overflow-hidden rounded-md bg-gray-100",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <svg
          viewBox="0 0 48 48"
          aria-hidden="true"
          className="absolute inset-0 m-auto h-1/2 w-1/2 text-gray-300"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 10h30L24 26Z" />
          <path d="M24 26v13M17 39h14" />
        </svg>
      )}
    </div>
  );
}
