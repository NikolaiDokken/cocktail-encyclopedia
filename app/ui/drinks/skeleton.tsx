// Loading animation
const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-linear-to-r before:from-transparent before:via-white/60 before:to-transparent";

function DrinkRowSkeleton() {
  return (
    <li
      className={`${shimmer} relative flex items-center gap-4 overflow-hidden px-3 py-4`}
    >
      <div className="size-14 shrink-0 rounded-md bg-gray-100" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-6 w-40 rounded-sm bg-gray-100" />
        <div className="h-4 w-2/3 rounded-sm bg-gray-100" />
      </div>
      <div className="h-10 w-10 rounded-md bg-gray-100" />
    </li>
  );
}

export default function DrinksListSkeleton() {
  return (
    <ul className="mt-6 divide-y divide-gray-200 border-y border-gray-200">
      {Array.from({ length: 6 }, (_, i) => (
        <DrinkRowSkeleton key={i} />
      ))}
    </ul>
  );
}
