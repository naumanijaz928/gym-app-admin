import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { isTokenExpired } from "@/lib/jwt";

export default async function HomePage() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth-token")?.value;

  // Check if user is authenticated
  const isAuthenticated = authToken && !isTokenExpired(authToken);

  if (isAuthenticated) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
