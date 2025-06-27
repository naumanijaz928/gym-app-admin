import "./globals.css";

import { Metadata } from "next";
import React from "react";

import { ThemeProvider } from "@/components/theme-provider";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Yourself Pilates",
  description: "Yourself Pilates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            themes={["orange", "dark", "light"]}
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
