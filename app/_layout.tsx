import "@/global.css";
import { Stack } from "expo-router";
import "react-native-reanimated";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Automatically maps all screens in the app folder */}
    </Stack>
  );
}
