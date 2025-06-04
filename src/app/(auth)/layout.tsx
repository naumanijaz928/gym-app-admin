import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Gym Booking | Login",
  description: "Gym Booking Application - Login Page",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
