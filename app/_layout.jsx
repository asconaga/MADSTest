import { Stack } from "expo-router";

// change the following to not show the header for index

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        // Global header styles
        headerStyle: { backgroundColor: '#4A90E2' },  // light blue header background
        headerTintColor: '#FFFFFF',                    // white back button and title text
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="optionsScreen" options={{ title: 'Options' }} />
      <Stack.Screen name="userListScreen" options={{ title: 'Users' }} />
    </Stack>
  );
}

