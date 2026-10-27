import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";
import SideNav from "@/app/ui/nav/sidenav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cocktail Encyclopedia",
  description:
    "Search cocktails by name or ingredient and save your favourites.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white antialiased`}>
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
          <div className="w-full flex-none md:w-64">
            <SideNav />
          </div>
          <div className="relative flex grow flex-col p-6 md:overflow-y-auto md:p-12">
            <div className="grow">{children}</div>
            <footer className="mt-16 text-xs text-gray-500">
              Drink photos from{" "}
              <a
                href="https://www.thecocktaildb.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-700"
              >
                TheCocktailDB
              </a>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
