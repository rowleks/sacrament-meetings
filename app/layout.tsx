import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sacrament Meeting Planner",
  description:
    "Help church leaders and members organize and manage sacrament meetings efficiently while maintaining a sacred, respectful design tone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
