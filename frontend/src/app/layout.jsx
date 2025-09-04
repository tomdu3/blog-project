
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "My Blog",
  description: "A blog powered by Next.js, FastAPI, and Notion CMS",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body
        className={`flex flex-col min-h-screen ${GeistSans.variable} ${GeistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <Navbar />
        <main className="flex-grow flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
