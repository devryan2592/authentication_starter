import { useOnboarding } from "@/hooks/use-onboarding";
import { MoonStar } from "@/lib/icons/MoonStar";
import { router } from "expo-router";
import React from "react";

import Onboarding from "react-native-onboarding-swiper";

const OnboardingScreens = () => {
  const { setHasCompletedOnboarding } = useOnboarding();

  const handleDone = async () => {
    await setHasCompletedOnboarding(true);
    router.replace("/(root)");
  };

  return (
    <Onboarding
      onDone={handleDone}
      onSkip={handleDone}
      pages={[
        {
          backgroundColor: "#fff",
          image: <MoonStar />,
          title: "Onboarding",
          subtitle: "Done with React Native Onboarding Swiper",
        },
        {
          backgroundColor: "#fe6e58",
          image: <MoonStar />,
          title: "The Title",
          subtitle: "This is the subtitle that sumplements the title.",
        },
        {
          backgroundColor: "#999",
          image: <MoonStar />,
          title: "Triangle",
          subtitle: "Beautiful, isn't it?",
        },
      ]}
    />
  );
};

export default OnboardingScreens;
