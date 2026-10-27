import Link from "next/link";
import { lusitana } from "@/app/ui/fonts";

export default function NotFound() {
  return (
    <div className="max-w-prose">
      <h1 className={`${lusitana.className} text-3xl text-gray-900`}>
        Drink not found
      </h1>
      <p className="mt-3 text-gray-600">
        This drink doesn&apos;t exist, or the link is incomplete.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block text-blue-600 hover:underline"
      >
        Search all drinks
      </Link>
    </div>
  );
}
