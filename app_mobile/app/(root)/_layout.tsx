import * as React from "react";
import { LoadingScreen } from "@/components/loading-screen";
import { useAuth } from "@/hooks/use-auth";
import { useOnboarding } from "@/hooks/use-onboarding";
import { Redirect, Slot, Stack } from "expo-router";

export default function AppLayout() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { hasCompletedOnboarding, isLoading: isOnboardingLoading } =
    useOnboarding();

  // Show loading screen while checking authentication and onboarding status
  if (isAuthLoading || isOnboardingLoading) {
    return <LoadingScreen />;
  }

  // Show onboarding for new users
  if (!hasCompletedOnboarding && !isOnboardingLoading) {
    return <Redirect href="/(onboarding)/onboarding" />;
  }

  // Redirect to auth flow if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }
  return <Stack />;
}
