import Link from "next/link";
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";
import NavLinks from "@/app/ui/nav/nav-links";
import SignOutButton, { navItemClass } from "@/app/ui/nav/sign-out-button";
import Logo from "@/app/ui/logo";
import { getSession } from "@/app/lib/auth";

export default async function SideNav() {
  const session = await getSession();

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-orange-400 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <Logo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        {session ? (
          <SignOutButton />
        ) : (
          <Link href="/login" className={navItemClass}>
            <ArrowRightEndOnRectangleIcon className="w-6" />
            <div className="hidden md:block">Log in</div>
          </Link>
        )}
      </div>
    </div>
  );
}
