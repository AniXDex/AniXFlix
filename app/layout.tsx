import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import ContextProvider from "@/providers/ContextProvider";
import ModalProvider from "@/providers/ModalProvider";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "react-hot-toast";
import DisableDevtoolWrapper from "@/components/DisableDevtoolWrapper";
import { Analytics } from "@vercel/analytics/react";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AniXFlix",
  description: "Watch your favorite movies and series on AniXFlix.",
  icons: {
    icon: "/apklogo-modified.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full w-full overflow-x-hidden",
        "antialiased",
        inter.className,
        "font-sans",
        geist.variable,
      )}
    >
      <head>
        <link rel="preconnect" href="https://screenscape.me" />
      </head>
      <ContextProvider>
        <body className="min-h-full flex flex-col w-full overflow-x-hidden">
          <DisableDevtoolWrapper />
          <Toaster />
          <QueryProvider>
            <ModalProvider>
              <div className="relative flex flex-col min-h-screen w-full overflow-x-hidden">
                <main>{children}</main>
              </div>
            </ModalProvider>
            <Analytics />
          </QueryProvider>
        </body>
      </ContextProvider>
    </html>
  );
}
