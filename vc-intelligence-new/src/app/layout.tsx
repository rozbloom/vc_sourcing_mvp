import type { Metadata } from "next";
import { Geist_Mono, Bricolage_Grotesque, DM_Sans } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/sidebar";

const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VC Scout",
  description: "VC Intelligence Interface",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${bricolage.variable} ${geistMono.variable} flex antialiased`}
      >
        <Sidebar />
        <main className="flex-1 p-8">{children}</main>
      </body>
    </html>
  );
}
