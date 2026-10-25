import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";
import SideNav from "@/app/ui/dashboard/sidenav";
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
      <body className={`${inter.className} antialiased`}>
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
          <div className="w-full flex-none md:w-64">
            <SideNav />
          </div>
          <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
