import type { Metadata } from "next";
import { Cairo, Geist } from "next/font/google";
import "./globals.css";
import SessionWrapper from "./SessionWrapper";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const cairo = Cairo({
    subsets: ["arabic", "latin"],
    variable: "--font-cairo",
    display: "swap",
});

export const metadata: Metadata = {
  title: "Shoply | Online Shopping",
  description: "Discover and shop for your favorite products with Shoppers.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", cairo.variable, "font-sans", geist.variable)}
    >
        <body className="min-h-full flex flex-col">
            <SessionWrapper>
                {children}
            </SessionWrapper>
        </body>
    </html>
  );
}
