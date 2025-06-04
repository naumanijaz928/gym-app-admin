import "./globals.css";

import { Metadata } from "next";
import React from "react";

import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Gym Booking",
  description: "Gym Booking Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          themes={["orange", "dark", "light"]}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
