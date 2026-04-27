import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/app/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MultiForma",
  description: "Ecommerce de impresión 3D",
};

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="es">
        <body className="min-h-screen flex flex-col">
          <CartProvider>
            <Header />            
            <main className="flex-1">
              {children}
            </main>            
            <Footer />
          </CartProvider>
        </body>
      </html>
    );
}
