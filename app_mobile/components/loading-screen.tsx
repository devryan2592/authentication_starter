import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function LoadingScreen() {
  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-background">
      <ActivityIndicator size="large" />
    </SafeAreaView>
  );
}
