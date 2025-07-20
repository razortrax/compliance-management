import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "../components/ConditionalNavbar";
import SelectorProvider from "../components/SelectorProvider";
import CompanyProvider from "../components/CompanyProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Compliance Management System",
  description: "Fleet compliance and safety management",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="layout-body">
        <CompanyProvider>
          <ConditionalNavbar />
          <SelectorProvider>
            <main className="main-content">{children}</main>
          </SelectorProvider>
        </CompanyProvider>
      </body>
    </html>
  );
}
