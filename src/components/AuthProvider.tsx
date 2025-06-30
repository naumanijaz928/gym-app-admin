// components/AuthProvider.tsx
"use client";

import React, { useEffect } from "react";

import { authService } from "@/lib/authService";
import { useAuthStore } from "@/stores/authStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { accessToken, refreshToken, logout, setLoading } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      if (!accessToken || !refreshToken) {
        setLoading(false);
        return;
      }

      // Check if access token is expired
      if (authService.isTokenExpired(accessToken)) {
        try {
          setLoading(true);
          await authService.refreshToken(refreshToken);
        } catch (error) {
          console.error("Token refresh failed:", error);
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [accessToken, refreshToken, logout, setLoading]);

  // Set up automatic token refresh
  useEffect(() => {
    if (!accessToken || !refreshToken) return;

    const scheduleRefresh = () => {
      try {
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        const expiryTime = payload.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const timeUntilExpiry = expiryTime - currentTime;

        // Refresh 5 minutes before expiry
        const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 0);

        const timeoutId = setTimeout(async () => {
          try {
            await authService.refreshToken(refreshToken);
            scheduleRefresh(); // Schedule next refresh
          } catch (error) {
            console.error("Automatic token refresh failed:", error);
            logout();
          }
        }, refreshTime);

        return () => clearTimeout(timeoutId);
      } catch (error) {
        console.error("Error scheduling token refresh:", error);
        logout();
      }
    };

    const cleanup = scheduleRefresh();
    return cleanup;
  }, [accessToken, refreshToken, logout]);

  // Sync auth state with cookies for middleware
  useEffect(() => {
    if (accessToken) {
      document.cookie = `auth-token=${accessToken}; path=/; max-age=${60 * 60}`; // 1 hour
    } else {
      document.cookie =
        "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }, [accessToken]);

  return <>{children}</>;
}
