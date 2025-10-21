import { AppProvider } from "@/context/AppProvider";
import "@/global.css";
import { Stack } from "expo-router";

import "react-native-reanimated";
import ToastManager from "toastify-react-native";

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "black" },
        }}
      >
        {/* All screens here will now use dark theme */}
      </Stack>
      <ToastManager
        width={"80%"}
        minHeight={50}
        iconSize={19}
        position={"bottom"}
        theme="dark"
      />
    </AppProvider>
  );
}
