// src/app/page.tsx
import { redirect } from "next/navigation";

export default function HomePage() {
  const user = false;

  redirect(user ? "/dashboard" : "/login");
}
