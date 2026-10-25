// Loading animation
const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-linear-to-r before:from-transparent before:via-white/60 before:to-transparent";

function DrinkCardSkeleton() {
  return (
    <div
      className={`${shimmer} relative flex w-full gap-4 overflow-hidden rounded-sm border border-gray-200 p-4`}
    >
      <div className="h-[100px] w-[150px] flex-none rounded-sm bg-gray-100" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-6 w-40 rounded-sm bg-gray-100" />
        <div className="h-4 w-full rounded-sm bg-gray-100" />
        <div className="h-4 w-2/3 rounded-sm bg-gray-100" />
      </div>
    </div>
  );
}

export default function DrinksListSkeleton() {
  return (
    <div className="mt-6 space-y-4">
      {Array.from({ length: 5 }, (_, i) => (
        <DrinkCardSkeleton key={i} />
      ))}
    </div>
  );
}
