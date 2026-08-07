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
  metadataBase: new URL("https://sacrament-meetings-three.vercel.app/"),
  title: {
    default: "Sacrament Meeting Planner",
    template: "%s | Sacrament Meeting Planner",
  },
  description:
    "Help church leaders and members organize and manage sacrament meetings efficiently while maintaining a sacred, respectful design tone.",
  applicationName: "Sacrament Meeting Planner",
  authors: [{ name: "Rowland Momoh" }],
  creator: "Rowland Momoh",
  publisher: "Rowland Momoh",
  keywords: [
    "sacrament meeting",
    "meeting planner",
    "LDS",
    "ward program",
    "meeting program",
    "opening hymn",
    "sacrament program",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sacrament-meetings-three.vercel.app/",
    siteName: "Sacrament Meeting Planner",
    title: "Sacrament Meeting Planner",
    description:
      "Organize and manage sacrament meetings efficiently while maintaining a sacred, respectful design tone.",
  },
  twitter: {
    card: "summary",
    title: "Sacrament Meeting Planner",
    description:
      "Help church leaders and members organize and manage sacrament meetings efficiently.",
  },
  alternates: {
    canonical: "/",
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
      className={`${inter.variable} ${lora.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Header />
        <main className="flex-1 container mx-auto py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
