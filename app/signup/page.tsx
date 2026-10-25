import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/auth";
import Logo from "@/app/ui/logo";
import SignupForm from "@/app/ui/signup-form";

export default async function SignupPage() {
  if (await getSession()) {
    redirect("/");
  }

  return (
    <main className="flex items-center justify-center">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4">
        <div className="flex h-20 w-full items-end rounded-lg bg-orange-400 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <Logo />
          </div>
        </div>
        <SignupForm />
      </div>
    </main>
  );
}
