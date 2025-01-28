import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

interface OnboardingStore {
  hasCompletedOnboarding: boolean | null;
  isLoading: boolean;
  setHasCompletedOnboarding: (value: boolean) => Promise<void>;
  checkOnboardingStatus: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  hasCompletedOnboarding: null,
  isLoading: true,
  setHasCompletedOnboarding: async (value) => {
    await AsyncStorage.setItem("hasCompletedOnboarding", JSON.stringify(value));
    set({ hasCompletedOnboarding: value });
  },
  checkOnboardingStatus: async () => {
    try {
      const value = await AsyncStorage.getItem("hasCompletedOnboarding");
      set({
        hasCompletedOnboarding: value ? JSON.parse(value) : false,
        isLoading: false,
      });
    } catch (error) {
      set({ hasCompletedOnboarding: false, isLoading: false });
    }
  },
}));

export const useOnboarding = () => {
  const store = useOnboardingStore();

  useEffect(() => {
    store.checkOnboardingStatus();
  }, []);

  return store;
};
