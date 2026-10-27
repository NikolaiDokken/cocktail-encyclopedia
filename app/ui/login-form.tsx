"use client";
import { lusitana } from "@/app/ui/fonts";
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "./button";
import { useFormSubmit } from "./use-form-submit";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import { safePath } from "@/app/lib/safe-path";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = safePath(searchParams.get("callbackUrl"));

  const { errorMessage, onSubmit, isPending } = useFormSubmit(
    async (formData) => {
      const { error } = await authClient.signIn.email({
        email: String(formData.get("email")),
        password: String(formData.get("password")),
      });
      if (error) {
        if (error.status === 429) {
          return "Too many attempts. Please wait a few minutes and try again.";
        }
        return error.status === 401
          ? "Invalid email or password."
          : "Something went wrong. Please try again.";
      }
      router.push(callbackUrl);
      router.refresh();
    },
  );

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pt-8 pb-4">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please log in to continue.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mt-5 mb-3 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute top-1/2 left-3 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mt-5 mb-3 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
              />
              <KeyIcon className="pointer-events-none absolute top-1/2 left-3 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <Button className="mt-4 w-full" aria-disabled={isPending}>
          Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <div className="flex h-8 items-end space-x-1">
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
        <p className="text-sm text-gray-600">
          No account yet?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
}
