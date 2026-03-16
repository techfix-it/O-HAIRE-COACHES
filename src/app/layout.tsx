import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import { GlobalBackground } from "@/components/GlobalBackground";
import "./globals.css";

export const metadata: Metadata = {
  title: "O'Haire Concert Coaches",
  description: "Premium concert travel services across Ireland",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GlobalBackground />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
